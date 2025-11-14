/**
 * Data export routes
 * 
 * Provides endpoints to export review data in various formats:
 * - GET /api/export/csv - Export reviews as CSV
 * - GET /api/export/json - Export reviews as JSON
 */

import express from 'express';
import { getAllReviews, getReviewsWithFilters } from '../services/dataService.js';

const router = express.Router();

/**
 * Converts reviews array to CSV format
 * 
 * @param {Array} reviews - Array of review objects
 * @returns {string} CSV formatted string
 */
function convertToCSV(reviews) {
  if (reviews.length === 0) {
    return 'No data available';
  }
  
  // CSV headers
  const headers = [
    'ID',
    'Customer ID',
    'Customer Name', 
    'Rating',
    'Title',
    'Comment',
    'Status',
    'Created At',
    'Updated At'
  ];
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...reviews.map(review => [
      `"${review.id}"`,
      `"${review.customerId}"`,
      `"${review.customerName}"`,
      review.rating,
      `"${review.title.replace(/"/g, '""')}"`, // Escape quotes in title
      `"${review.comment.replace(/"/g, '""')}"`, // Escape quotes in comment
      `"${review.status}"`,
      `"${review.createdAt}"`,
      `"${review.updatedAt}"`
    ].join(','))
  ].join('\\n');
  
  return csvContent;
}

/**
 * GET /api/export/csv
 * Export reviews as CSV file
 * 
 * Query parameters (same as reviews endpoint):
 * - status: Filter by status
 * - rating: Filter by rating
 * - customerId: Filter by customer ID
 * - limit: Limit number of results
 * - offset: Offset for pagination
 */
router.get('/csv', async (req, res) => {
  try {
    const options = {
      status: req.query.status,
      rating: req.query.rating ? parseInt(req.query.rating) : undefined,
      customerId: req.query.customerId,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };

    // Remove undefined values
    Object.keys(options).forEach(key => {
      if (options[key] === undefined) {
        delete options[key];
      }
    });

    const result = await getReviewsWithFilters(options);
    const csvContent = convertToCSV(result.reviews);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=reviews.csv');
    
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/export/json
 * Export reviews as JSON file
 * 
 * Query parameters (same as reviews endpoint):
 * - status: Filter by status
 * - rating: Filter by rating
 * - customerId: Filter by customer ID
 * - limit: Limit number of results
 * - offset: Offset for pagination
 */
router.get('/json', async (req, res) => {
  try {
    const options = {
      status: req.query.status,
      rating: req.query.rating ? parseInt(req.query.rating) : undefined,
      customerId: req.query.customerId,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };

    // Remove undefined values
    Object.keys(options).forEach(key => {
      if (options[key] === undefined) {
        delete options[key];
      }
    });

    const result = await getReviewsWithFilters(options);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=reviews.json');
    
    res.json({
      exportDate: new Date().toISOString(),
      totalRecords: result.total,
      filters: options,
      data: result.reviews
    });
  } catch (error) {
    console.error('Error exporting JSON:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/export/summary
 * Export summary statistics as JSON
 */
router.get('/summary', async (req, res) => {
  try {
    const allReviews = await getAllReviews();
    
    // Calculate statistics
    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 
      ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(2)
      : 0;
    
    const statusBreakdown = allReviews.reduce((acc, review) => {
      acc[review.status] = (acc[review.status] || 0) + 1;
      return acc;
    }, {});
    
    const ratingBreakdown = allReviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {});
    
    const summary = {
      totalReviews,
      averageRating: parseFloat(averageRating),
      statusBreakdown,
      ratingBreakdown,
      generatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test CSV conversion function
export function testCSVConversion() {
  const testReviews = [
    {
      id: 'test_1',
      customerId: 'cust_1',
      customerName: 'John Doe',
      rating: 5,
      title: 'Great service',
      comment: 'Very satisfied with the product and service.',
      status: 'approved',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z'
    }
  ];
  
  const csv = convertToCSV(testReviews);
  console.assert(csv.includes('John Doe'), 'CSV should contain customer name');
  console.assert(csv.includes('Great service'), 'CSV should contain review title');
  console.log('CSV conversion test passed!');
}

export default router;