/**
 * Database export wrapper for Data Warehouse Systems
 * 
 * Acts as a database export wrapper that respects Accept headers.
 * Main endpoint: GET /api/export - Returns entire database in requested format
 * Legacy endpoints maintained for backwards compatibility
 */

import express from 'express';
import { getAllReviews, getReviewsWithFilters } from '../services/dataService.js';

const router = express.Router();

/**
 * GET /api/export
 * Main database export endpoint for Data Warehouse Systems
 * 
 * Respects Accept header to determine output format:
 * - application/json -> JSON format
 * - text/csv or application/csv -> CSV format  
 * - application/xml or text/xml -> XML format
 * - Default: JSON format
 * 
 * Returns the entire reviews database in the requested format
 */
router.get('/', async (req, res) => {
  try {
    const allReviews = await getAllReviews();
    const acceptHeader = req.get('Accept');
    const format = parseAcceptHeader(acceptHeader);
    
    switch (format) {
      case 'csv':
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=database_export.csv');
        res.send(convertToCSV(allReviews));
        break;
        
      case 'xml':
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=database_export.xml');
        res.send(convertToXML(allReviews));
        break;
        
      case 'json':
      default:
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json({
          metadata: {
            exportDate: new Date().toISOString(),
            totalRecords: allReviews.length,
            format: 'json',
            source: 'customer_satisfaction_database'
          },
          data: allReviews
        });
        break;
    }
  } catch (error) {
    console.error('Database export error:', error);
    res.status(500).json({
      success: false,
      error: 'Database export failed',
      details: error.message
    });
  }
});

/**
 * Converts reviews array to CSV format
 * 
 * @param {Array} reviews - Array of review objects
 * @returns {string} CSV formatted string
 */
function convertToCSV(reviews) {
  if (reviews.length === 0) {
    return 'id,customerId,customerName,rating,title,comment,status,createdAt,updatedAt\n';
  }
  
  // CSV headers
  const headers = [
    'id',
    'customerId',
    'customerName', 
    'rating',
    'title',
    'comment',
    'status',
    'createdAt',
    'updatedAt'
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
  ].join('\n');
  
  return csvContent;
}

/**
 * Converts reviews array to XML format for Data Warehouse Systems
 * 
 * @param {Array} reviews - Array of review objects
 * @returns {string} XML formatted string
 */
function convertToXML(reviews) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const rootStart = '<reviews>\n';
  const rootEnd = '</reviews>';
  
  if (reviews.length === 0) {
    return xmlHeader + rootStart + rootEnd;
  }
  
  const xmlContent = reviews.map(review => {
    return `  <review>
    <id>${escapeXML(review.id)}</id>
    <customerId>${escapeXML(review.customerId)}</customerId>
    <customerName>${escapeXML(review.customerName)}</customerName>
    <rating>${review.rating}</rating>
    <title>${escapeXML(review.title)}</title>
    <comment>${escapeXML(review.comment)}</comment>
    <status>${escapeXML(review.status)}</status>
    <createdAt>${escapeXML(review.createdAt)}</createdAt>
    <updatedAt>${escapeXML(review.updatedAt)}</updatedAt>
  </review>`;
  }).join('\n');
  
  return xmlHeader + rootStart + xmlContent + '\n' + rootEnd;
}

/**
 * Escapes XML special characters
 * 
 * @param {string} str - String to escape
 * @returns {string} XML-safe string
 */
function escapeXML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Parse Accept header to determine preferred format
 * 
 * @param {string} acceptHeader - Accept header from request
 * @returns {string} Format: 'json', 'csv', 'xml', or 'json' (default)
 */
function parseAcceptHeader(acceptHeader) {
  if (!acceptHeader) return 'json';
  
  const accepts = acceptHeader.toLowerCase().split(',').map(type => type.trim());
  
  // Check for specific formats in order of preference
  if (accepts.some(type => type.includes('text/csv') || type.includes('application/csv'))) {
    return 'csv';
  }
  if (accepts.some(type => type.includes('application/xml') || type.includes('text/xml'))) {
    return 'xml';
  }
  if (accepts.some(type => type.includes('application/json'))) {
    return 'json';
  }
  
  // Default to JSON for any other case
  return 'json';
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

// Test functions for database export functionality
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
  console.assert(csv.startsWith('id,customerId'), 'CSV should start with headers');
  console.log('CSV conversion test passed!');
}

export function testXMLConversion() {
  const testReviews = [
    {
      id: 'test_1',
      customerId: 'cust_1',
      customerName: 'John & Jane',
      rating: 5,
      title: 'Great "service"',
      comment: 'Very satisfied with the product & service.',
      status: 'approved',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z'
    }
  ];
  
  const xml = convertToXML(testReviews);
  console.assert(xml.includes('<?xml version="1.0"'), 'XML should have proper header');
  console.assert(xml.includes('<reviews>'), 'XML should have root element');
  console.assert(xml.includes('John &amp; Jane'), 'XML should escape ampersands');
  console.assert(xml.includes('Great &quot;service&quot;'), 'XML should escape quotes');
  console.log('XML conversion test passed!');
}

export function testAcceptHeaderParsing() {
  // Test JSON (default)
  console.assert(parseAcceptHeader('') === 'json', 'Empty accept header should default to json');
  console.assert(parseAcceptHeader('application/json') === 'json', 'JSON accept header');
  
  // Test CSV
  console.assert(parseAcceptHeader('text/csv') === 'csv', 'CSV accept header');
  console.assert(parseAcceptHeader('application/csv') === 'csv', 'Alternative CSV accept header');
  
  // Test XML
  console.assert(parseAcceptHeader('application/xml') === 'xml', 'XML accept header');
  console.assert(parseAcceptHeader('text/xml') === 'xml', 'Alternative XML accept header');
  
  // Test complex accept headers
  console.assert(parseAcceptHeader('text/html,application/xml;q=0.9,*/*;q=0.8') === 'xml', 'Complex accept header with XML');
  console.assert(parseAcceptHeader('text/html,text/csv;q=0.9,*/*;q=0.8') === 'csv', 'Complex accept header with CSV');
  
  console.log('Accept header parsing tests passed!');
}

export function testXMLEscaping() {
  console.assert(escapeXML('John & Jane') === 'John &amp; Jane', 'Should escape ampersands');
  console.assert(escapeXML('<script>') === '&lt;script&gt;', 'Should escape angle brackets');
  console.assert(escapeXML('"quoted"') === '&quot;quoted&quot;', 'Should escape quotes');
  console.assert(escapeXML("'single'") === '&#39;single&#39;', 'Should escape single quotes');
  console.log('XML escaping tests passed!');
}

// Run all tests
export function runAllExportTests() {
  try {
    testCSVConversion();
    testXMLConversion();
    testAcceptHeaderParsing();
    testXMLEscaping();
    console.log('All export functionality tests passed!');
  } catch (error) {
    console.error('Export tests failed:', error);
  }
}

export default router;