/**
 * API Test Suite
 * 
 * Comprehensive tests for the Reviews API endpoints.
 * Run this file to test all functionality.
 * 
 * To run: node src/tests/apiTests.js
 */

const API_BASE = 'http://localhost:2509/api';

/**
 * Makes an HTTP request to the API
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response object with data and status
 */
async function makeRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return {
      status: response.status,
      data,
      ok: response.ok
    };
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error);
    return {
      status: 500,
      data: { error: error.message },
      ok: false
    };
  }
}

/**
 * Test helper to assert conditions
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Test creating a new review
 */
async function testCreateReview() {
  console.log('Testing review creation...');
  
  const reviewData = {
    customerId: 'test_customer_1',
    customerName: 'John Test',
    rating: 5,
    title: 'Excellent service!',
    comment: 'I was very satisfied with the product quality and customer service.'
  };
  
  const response = await makeRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
  
  assert(response.status === 201, `Expected status 201, got ${response.status}`);
  assert(response.data.success === true, 'Response should indicate success');
  assert(response.data.data.id, 'Review should have an ID');
  assert(response.data.data.rating === 5, 'Rating should match input');
  assert(response.data.data.status === 'pending', 'Default status should be pending');
  
  console.log('✓ Review creation test passed');
  return response.data.data.id; // Return ID for other tests
}

/**
 * Test getting all reviews
 */
async function testGetAllReviews() {
  console.log('Testing get all reviews...');
  
  const response = await makeRequest('/reviews');
  
  assert(response.status === 200, `Expected status 200, got ${response.status}`);
  assert(response.data.success === true, 'Response should indicate success');
  assert(Array.isArray(response.data.data.reviews), 'Should return reviews array');
  assert(typeof response.data.data.total === 'number', 'Should return total count');
  
  console.log('✓ Get all reviews test passed');
}

/**
 * Test getting a specific review by ID
 */
async function testGetReviewById(reviewId) {
  console.log('Testing get review by ID...');
  
  const response = await makeRequest(`/reviews/${reviewId}`);
  
  assert(response.status === 200, `Expected status 200, got ${response.status}`);
  assert(response.data.success === true, 'Response should indicate success');
  assert(response.data.data.id === reviewId, 'Should return correct review');
  
  console.log('✓ Get review by ID test passed');
}

/**
 * Test updating a review
 */
async function testUpdateReview(reviewId) {
  console.log('Testing review update...');
  
  const updateData = {
    rating: 4,
    status: 'approved',
    comment: 'Updated comment with new information.'
  };
  
  const response = await makeRequest(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  
  assert(response.status === 200, `Expected status 200, got ${response.status}`);
  assert(response.data.success === true, 'Response should indicate success');
  assert(response.data.data.rating === 4, 'Rating should be updated');
  assert(response.data.data.status === 'approved', 'Status should be updated');
  
  console.log('✓ Review update test passed');
}

/**
 * Test review validation
 */
async function testReviewValidation() {
  console.log('Testing review validation...');
  
  // Test missing required fields
  const invalidReview = {
    rating: 5
    // Missing other required fields
  };
  
  const response = await makeRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(invalidReview)
  });
  
  assert(response.status === 400, `Expected status 400, got ${response.status}`);
  assert(response.data.success === false, 'Response should indicate failure');
  assert(Array.isArray(response.data.details), 'Should return validation errors');
  
  console.log('✓ Review validation test passed');
}

/**
 * Test export functionality
 */
async function testExportFunctionality() {
  console.log('Testing export functionality...');
  
  // Test JSON export
  const jsonResponse = await makeRequest('/export/json');
  assert(jsonResponse.status === 200, `Expected status 200 for JSON export, got ${jsonResponse.status}`);
  
  // Test summary export
  const summaryResponse = await makeRequest('/export/summary');
  assert(summaryResponse.status === 200, `Expected status 200 for summary, got ${summaryResponse.status}`);
  assert(summaryResponse.data.success === true, 'Summary response should indicate success');
  assert(typeof summaryResponse.data.data.totalReviews === 'number', 'Should return total reviews count');
  
  console.log('✓ Export functionality test passed');
}

/**
 * Test deleting a review
 */
async function testDeleteReview(reviewId) {
  console.log('Testing review deletion...');
  
  const response = await makeRequest(`/reviews/${reviewId}`, {
    method: 'DELETE'
  });
  
  assert(response.status === 200, `Expected status 200, got ${response.status}`);
  assert(response.data.success === true, 'Response should indicate success');
  
  // Verify review is deleted
  const getResponse = await makeRequest(`/reviews/${reviewId}`);
  assert(getResponse.status === 404, 'Review should not be found after deletion');
  
  console.log('✓ Review deletion test passed');
}

/**
 * Test 404 error handling
 */
async function testErrorHandling() {
  console.log('Testing error handling...');
  
  // Test getting non-existent review
  const response = await makeRequest('/reviews/non-existent-id');
  assert(response.status === 404, `Expected status 404, got ${response.status}`);
  assert(response.data.success === false, 'Response should indicate failure');
  
  console.log('✓ Error handling test passed');
}

/**
 * Run all API tests
 */
async function runAllTests() {
  console.log('🚀 Starting API tests...\\n');
  
  try {
    // Test server is running
    const healthResponse = await makeRequest('/reviews');
    if (healthResponse.status !== 200) {
      throw new Error('Server is not running. Please start the server first with: npm start');
    }
    
    // Run tests in sequence
    const reviewId = await testCreateReview();
    await testGetAllReviews();
    await testGetReviewById(reviewId);
    await testUpdateReview(reviewId);
    await testReviewValidation();
    await testExportFunctionality();
    await testErrorHandling();
    await testDeleteReview(reviewId); // Delete test data
    
    console.log('\\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('\\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests };