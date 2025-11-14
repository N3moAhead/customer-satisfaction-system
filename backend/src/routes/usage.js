/**
 * Usage/Details API routes for dashboard
 * 
 * Provides endpoints for detailed usage records and data tables:
 * - GET /api/usage/details - Get detailed records for data table
 */

import express from 'express';
import { getAllReviews, getReviewsWithFilters } from '../services/dataService.js';

const router = express.Router();

/**
 * Transform review data to match dashboard details table format
 * 
 * @param {Array} reviews - Array of review objects
 * @returns {Array} Array of transformed records for the details table
 */
function transformReviewsForDetailsTable(reviews) {
  return reviews.map(review => ({
    id: review.id,
    owner: review.customerName,
    customerId: review.customerId,
    status: review.status,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    costs: `$${(Math.random() * 50 + 10).toFixed(2)}`, // Mock cost data
    region: ['US-East', 'US-West', 'EU-Central', 'Asia-Pacific'][Math.floor(Math.random() * 4)], // Mock region
    stability: review.rating >= 4 ? 'Stable' : review.rating >= 3 ? 'Warning' : 'Critical',
    lastEdited: review.updatedAt,
    createdAt: review.createdAt,
    // Additional fields for filtering/sorting
    sentiment: review.rating >= 4 ? 'Positive' : review.rating === 3 ? 'Neutral' : 'Negative',
    priority: review.rating <= 2 ? 'High' : review.rating === 3 ? 'Medium' : 'Low'
  }));
}

/**
 * GET /api/usage/details
 * Get detailed usage records for the dashboard details table
 * 
 * Query parameters:
 * - status: Filter by status (pending, approved, rejected)
 * - rating: Filter by rating (1-5)
 * - customerId: Filter by customer ID
 * - owner: Filter by customer name
 * - region: Filter by region
 * - stability: Filter by stability status
 * - sentiment: Filter by sentiment (Positive, Neutral, Negative)
 * - priority: Filter by priority (High, Medium, Low)
 * - limit: Limit number of results (default: 50)
 * - offset: Offset for pagination (default: 0)
 * - sortBy: Field to sort by (default: createdAt)
 * - sortOrder: Sort order (asc, desc, default: desc)
 * - search: Search term to filter by title, comment, or customer name
 */
router.get('/details', async (req, res) => {
  try {
    // Extract query parameters
    const {
      status,
      rating,
      customerId,
      owner,
      region,
      stability,
      sentiment,
      priority,
      limit = 50,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Get base reviews with existing filters
    const baseFilters = {
      status,
      rating: rating ? parseInt(rating) : undefined,
      customerId,
      limit: undefined, // We'll handle pagination after transformation
      offset: undefined
    };

    // Remove undefined values
    Object.keys(baseFilters).forEach(key => {
      if (baseFilters[key] === undefined) {
        delete baseFilters[key];
      }
    });

    const result = await getReviewsWithFilters(baseFilters);
    let transformedRecords = transformReviewsForDetailsTable(result.reviews);

    // Apply additional filters
    if (owner) {
      transformedRecords = transformedRecords.filter(record => 
        record.owner.toLowerCase().includes(owner.toLowerCase())
      );
    }

    if (region) {
      transformedRecords = transformedRecords.filter(record => 
        record.region === region
      );
    }

    if (stability) {
      transformedRecords = transformedRecords.filter(record => 
        record.stability === stability
      );
    }

    if (sentiment) {
      transformedRecords = transformedRecords.filter(record => 
        record.sentiment === sentiment
      );
    }

    if (priority) {
      transformedRecords = transformedRecords.filter(record => 
        record.priority === priority
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      transformedRecords = transformedRecords.filter(record => 
        record.title.toLowerCase().includes(searchTerm) ||
        record.comment.toLowerCase().includes(searchTerm) ||
        record.owner.toLowerCase().includes(searchTerm) ||
        record.customerId.toLowerCase().includes(searchTerm)
      );
    }

    // Sort records
    transformedRecords.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle different data types
      if (sortBy === 'createdAt' || sortBy === 'lastEdited') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortBy === 'rating') {
        aVal = parseInt(aVal);
        bVal = parseInt(bVal);
      } else if (sortBy === 'costs') {
        aVal = parseFloat(aVal.replace('$', ''));
        bVal = parseFloat(bVal.replace('$', ''));
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    // Apply pagination
    const totalRecords = transformedRecords.length;
    const paginatedRecords = transformedRecords.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );

    // Calculate summary statistics for the filtered data
    const statistics = {
      total: totalRecords,
      statusBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {}),
      sentimentBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.sentiment] = (acc[record.sentiment] || 0) + 1;
        return acc;
      }, {}),
      stabilityBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.stability] = (acc[record.stability] || 0) + 1;
        return acc;
      }, {}),
      regionBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.region] = (acc[record.region] || 0) + 1;
        return acc;
      }, {}),
      averageRating: transformedRecords.length > 0 
        ? Math.round((transformedRecords.reduce((sum, r) => sum + r.rating, 0) / transformedRecords.length) * 100) / 100
        : 0
    };

    res.json({
      success: true,
      data: {
        records: paginatedRecords,
        pagination: {
          total: totalRecords,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < totalRecords
        },
        statistics,
        filters: {
          status,
          rating,
          customerId,
          owner,
          region,
          stability,
          sentiment,
          priority,
          search,
          sortBy,
          sortOrder
        }
      }
    });
  } catch (error) {
    console.error('Error getting usage details:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/usage/summary
 * Get summary statistics for usage/details
 */
router.get('/summary', async (req, res) => {
  try {
    const allReviews = await getAllReviews();
    const transformedRecords = transformReviewsForDetailsTable(allReviews);

    const summary = {
      totalRecords: transformedRecords.length,
      statusBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {}),
      sentimentBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.sentiment] = (acc[record.sentiment] || 0) + 1;
        return acc;
      }, {}),
      stabilityBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.stability] = (acc[record.stability] || 0) + 1;
        return acc;
      }, {}),
      regionBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.region] = (acc[record.region] || 0) + 1;
        return acc;
      }, {}),
      priorityBreakdown: transformedRecords.reduce((acc, record) => {
        acc[record.priority] = (acc[record.priority] || 0) + 1;
        return acc;
      }, {}),
      averageRating: transformedRecords.length > 0 
        ? Math.round((transformedRecords.reduce((sum, r) => sum + r.rating, 0) / transformedRecords.length) * 100) / 100
        : 0,
      generatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting usage summary:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test transformation function
export function testDetailsTransformation() {
  const testReviews = [
    {
      id: 'test_1',
      customerId: 'cust_1',
      customerName: 'John Doe',
      rating: 5,
      title: 'Great service',
      comment: 'Very satisfied',
      status: 'approved',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z'
    }
  ];
  
  const transformed = transformReviewsForDetailsTable(testReviews);
  console.assert(transformed.length === 1, 'Should transform 1 review');
  console.assert(transformed[0].owner === 'John Doe', 'Should map customerName to owner');
  console.assert(transformed[0].sentiment === 'Positive', 'Should calculate sentiment correctly');
  console.assert(transformed[0].stability === 'Stable', 'Should calculate stability correctly');
  console.log('Details transformation test passed!');
}

export default router;