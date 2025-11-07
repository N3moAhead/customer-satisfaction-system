/**
 * Metrics API routes for dashboard
 * 
 * Provides endpoints for dashboard analytics and time-series data:
 * - GET /api/metrics - Get dashboard-compatible OverviewData metrics
 * - GET /api/metrics/timeseries - Get time-series metrics data
 * - GET /api/metrics/summary - Get KPI summary with period comparisons
 * - GET /api/usage/details - Get detailed usage/review records
 */

import express from 'express';
import { getAllReviews, getReviewsWithFilters } from '../services/dataService.js';
import { generateMetrics, getMetricsSummary } from '../services/metricsService.js';

const router = express.Router();

/**
 * GET /api/metrics
 * Get dashboard-compatible OverviewData metrics for the main dashboard
 * 
 * Query parameters:
 * - startDate: Start date (ISO format, defaults to 365 days ago)
 * - endDate: End date (ISO format, defaults to today)
 * 
 * Returns data in OverviewData format expected by the dashboard components
 */
router.get('/', async (req, res) => {
  try {
    // Get date range parameters or use defaults
    const endDate = req.query.endDate || new Date().toISOString();
    const startDate = req.query.startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    
    // Generate dashboard metrics using our service
    const overviewData = generateMetrics(startDate, endDate);
    
    res.json({
      success: true,
      data: overviewData,
      meta: {
        startDate,
        endDate,
        totalDays: overviewData.length,
        generatedAt: new Date().toISOString(),
        dataSource: 'customer_satisfaction_reviews'
      }
    });
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate dashboard metrics',
      details: error.message
    });
  }
});

/**
 * Calculate daily metrics from review data
 * 
 * @param {Array} reviews - Array of review objects
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Array} Array of daily metrics objects
 */
function calculateDailyMetrics(reviews, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dailyMetrics = [];
  
  // Generate all dates in range
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Filter reviews for this date
    const dayReviews = reviews.filter(review => {
      const reviewDate = new Date(review.createdAt).toISOString().split('T')[0];
      return reviewDate === dateStr;
    });
    
    // Calculate metrics for this day
    const dayMetrics = {
      date: dateStr,
      "Reviews submitted": dayReviews.length,
      "Reviews approved": dayReviews.filter(r => r.status === 'approved').length,
      "Reviews pending": dayReviews.filter(r => r.status === 'pending').length,
      "Reviews rejected": dayReviews.filter(r => r.status === 'rejected').length,
      "Average rating": dayReviews.length > 0 
        ? Math.round((dayReviews.reduce((sum, r) => sum + r.rating, 0) / dayReviews.length) * 100) / 100
        : 0,
      "5-star reviews": dayReviews.filter(r => r.rating === 5).length,
      "Customer interactions": dayReviews.length, // Same as reviews submitted for now
      "Support escalations": dayReviews.filter(r => r.rating <= 2).length // Low ratings might need support
    };
    
    dailyMetrics.push(dayMetrics);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dailyMetrics;
}

/**
 * GET /api/metrics/timeseries
 * Get time-series metrics data for dashboard charts
 * 
 * Query parameters:
 * - startDate: Start date (ISO format, defaults to 30 days ago)
 * - endDate: End date (ISO format, defaults to today)
 * - metrics: Comma-separated list of metrics to include (optional)
 */
router.get('/timeseries', async (req, res) => {
  try {
    // Default to last 30 days if no dates provided
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get all reviews
    const allReviews = await getAllReviews();
    
    // Calculate daily metrics
    const dailyMetrics = calculateDailyMetrics(allReviews, startDate, endDate);
    
    // Filter metrics if specific ones were requested
    if (req.query.metrics) {
      const requestedMetrics = req.query.metrics.split(',').map(m => m.trim());
      const filteredMetrics = dailyMetrics.map(day => {
        const filtered = { date: day.date };
        requestedMetrics.forEach(metric => {
          if (day[metric] !== undefined) {
            filtered[metric] = day[metric];
          }
        });
        return filtered;
      });
      
      return res.json({
        success: true,
        data: filteredMetrics,
        meta: {
          startDate,
          endDate,
          requestedMetrics
        }
      });
    }
    
    res.json({
      success: true,
      data: dailyMetrics,
      meta: {
        startDate,
        endDate,
        totalDays: dailyMetrics.length
      }
    });
  } catch (error) {
    console.error('Error getting timeseries metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Calculate period comparison statistics
 * 
 * @param {Array} currentPeriod - Reviews from current period
 * @param {Array} previousPeriod - Reviews from previous period
 * @returns {Object} Comparison statistics
 */
function calculatePeriodComparison(currentPeriod, previousPeriod) {
  const current = {
    totalReviews: currentPeriod.length,
    averageRating: currentPeriod.length > 0 
      ? currentPeriod.reduce((sum, r) => sum + r.rating, 0) / currentPeriod.length
      : 0,
    approvedReviews: currentPeriod.filter(r => r.status === 'approved').length,
    pendingReviews: currentPeriod.filter(r => r.status === 'pending').length,
    fiveStarReviews: currentPeriod.filter(r => r.rating === 5).length,
    lowRatingReviews: currentPeriod.filter(r => r.rating <= 2).length
  };
  
  const previous = {
    totalReviews: previousPeriod.length,
    averageRating: previousPeriod.length > 0 
      ? previousPeriod.reduce((sum, r) => sum + r.rating, 0) / previousPeriod.length
      : 0,
    approvedReviews: previousPeriod.filter(r => r.status === 'approved').length,
    pendingReviews: previousPeriod.filter(r => r.status === 'pending').length,
    fiveStarReviews: previousPeriod.filter(r => r.rating === 5).length,
    lowRatingReviews: previousPeriod.filter(r => r.rating <= 2).length
  };
  
  // Calculate percentage changes
  const calculateChange = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100 * 100) / 100;
  };
  
  return {
    current,
    previous,
    changes: {
      totalReviews: calculateChange(current.totalReviews, previous.totalReviews),
      averageRating: calculateChange(current.averageRating, previous.averageRating),
      approvedReviews: calculateChange(current.approvedReviews, previous.approvedReviews),
      pendingReviews: calculateChange(current.pendingReviews, previous.pendingReviews),
      fiveStarReviews: calculateChange(current.fiveStarReviews, previous.fiveStarReviews),
      lowRatingReviews: calculateChange(current.lowRatingReviews, previous.lowRatingReviews)
    }
  };
}

/**
 * GET /api/metrics/summary
 * Get KPI summary with period comparisons
 * 
 * Query parameters:
 * - startDate: Current period start date
 * - endDate: Current period end date
 * - comparison: Type of comparison (previous_period, last_year, none)
 */
router.get('/summary', async (req, res) => {
  try {
     // Default to last 7 days if no dates provided
    const endDate = new Date(req.query.endDate || Date.now());
    const startDate = new Date(req.query.startDate || Date.now() - 7 * 24 * 60 * 60 * 1000);
    const comparison = req.query.comparison || 'previous_period';
    
    // Set end date to end of day for inclusive comparison
    endDate.setHours(23, 59, 59, 999);
    // Set start date to beginning of day
    startDate.setHours(0, 0, 0, 0);
    
    // Get all reviews
    const allReviews = await getAllReviews();
    
    // Filter reviews for current period
    const currentPeriodReviews = allReviews.filter(review => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= startDate && reviewDate <= endDate;
    });
    
    let comparisonData = null;
    
    if (comparison !== 'none') {
      let comparisonStartDate, comparisonEndDate;
      const periodLength = endDate.getTime() - startDate.getTime();
      
      if (comparison === 'previous_period') {
        comparisonEndDate = new Date(startDate.getTime() - 1);
        comparisonStartDate = new Date(comparisonEndDate.getTime() - periodLength);
      } else if (comparison === 'last_year') {
        comparisonStartDate = new Date(startDate);
        comparisonStartDate.setFullYear(startDate.getFullYear() - 1);
        comparisonEndDate = new Date(endDate);
        comparisonEndDate.setFullYear(endDate.getFullYear() - 1);
      }
      
      const comparisonPeriodReviews = allReviews.filter(review => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate >= comparisonStartDate && reviewDate <= comparisonEndDate;
      });
      
      comparisonData = calculatePeriodComparison(currentPeriodReviews, comparisonPeriodReviews);
    }
    
    // Calculate current period statistics
    const totalReviews = currentPeriodReviews.length;
    const averageRating = totalReviews > 0 
      ? Math.round((currentPeriodReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 100) / 100
      : 0;
    
    const statusBreakdown = currentPeriodReviews.reduce((acc, review) => {
      acc[review.status] = (acc[review.status] || 0) + 1;
      return acc;
    }, {});
    
    const ratingBreakdown = currentPeriodReviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate satisfaction score (4-5 star reviews / total reviews)
    const satisfactionScore = totalReviews > 0 
      ? Math.round(((currentPeriodReviews.filter(r => r.rating >= 4).length / totalReviews) * 100) * 100) / 100
      : 0;
    
    const summary = {
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      metrics: {
        totalReviews,
        averageRating,
        satisfactionScore,
        statusBreakdown,
        ratingBreakdown,
        customerSentiment: {
          positive: currentPeriodReviews.filter(r => r.rating >= 4).length,
          neutral: currentPeriodReviews.filter(r => r.rating === 3).length,
          negative: currentPeriodReviews.filter(r => r.rating <= 2).length
        }
      },
      comparison: comparisonData,
      generatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting metrics summary:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test daily metrics calculation
export function testDailyMetricsCalculation() {
  const testReviews = [
    {
      id: '1',
      customerId: 'cust_1',
      customerName: 'Test User',
      rating: 5,
      title: 'Great',
      comment: 'Excellent',
      status: 'approved',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z'
    },
    {
      id: '2',
      customerId: 'cust_2',
      customerName: 'Test User 2',
      rating: 2,
      title: 'Poor',
      comment: 'Not good',
      status: 'pending',
      createdAt: '2023-01-01T15:00:00Z',
      updatedAt: '2023-01-01T15:00:00Z'
    }
  ];
  
  const metrics = calculateDailyMetrics(testReviews, '2023-01-01', '2023-01-01');
  console.assert(metrics.length === 1, 'Should have 1 day of metrics');
  console.assert(metrics[0]['Reviews submitted'] === 2, 'Should have 2 reviews submitted');
  console.assert(metrics[0]['Average rating'] === 3.5, 'Average rating should be 3.5');
  console.log('Daily metrics calculation test passed!');
}

export default router;