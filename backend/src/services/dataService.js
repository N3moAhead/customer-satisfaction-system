/**
 * Data storage service for reviews using JSON file storage
 * 
 * This service handles CRUD operations for reviews with persistent storage
 * in a JSON file. In a production environment, this would be replaced with
 * a proper database like PostgreSQL or MongoDB.
 */

import jsonfile from 'jsonfile';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file path
const DATA_FILE = path.join(__dirname, '../data/reviews.json');

/**
 * Reads all reviews from the JSON file
 * 
 * @returns {Promise<Array>} Array of review objects
 */
export async function getAllReviews() {
  try {
    const reviews = await jsonfile.readFile(DATA_FILE);
    return reviews || [];
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Finds a review by ID
 * 
 * @param {string} id - Review ID
 * @returns {Promise<Object|null>} Review object or null if not found
 */
export async function getReviewById(id) {
  const reviews = await getAllReviews();
  return reviews.find(review => review.id === id) || null;
}

/**
 * Finds reviews by customer ID
 * 
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} Array of reviews for the customer
 */
export async function getReviewsByCustomerId(customerId) {
  const reviews = await getAllReviews();
  return reviews.filter(review => review.customerId === customerId);
}

/**
 * Saves a new review to storage
 * 
 * @param {Object} review - Review object to save
 * @returns {Promise<Object>} Saved review object
 */
export async function saveReview(review) {
  const reviews = await getAllReviews();
  reviews.push(review);
  await jsonfile.writeFile(DATA_FILE, reviews, { spaces: 2 });
  return review;
}

/**
 * Updates an existing review
 * 
 * @param {string} id - Review ID
 * @param {Object} updatedReview - Updated review object
 * @returns {Promise<Object|null>} Updated review or null if not found
 */
export async function updateReviewById(id, updatedReview) {
  const reviews = await getAllReviews();
  const index = reviews.findIndex(review => review.id === id);
  
  if (index === -1) {
    return null;
  }
  
  reviews[index] = updatedReview;
  await jsonfile.writeFile(DATA_FILE, reviews, { spaces: 2 });
  return updatedReview;
}

/**
 * Deletes a review by ID
 * 
 * @param {string} id - Review ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteReviewById(id) {
  const reviews = await getAllReviews();
  const index = reviews.findIndex(review => review.id === id);
  
  if (index === -1) {
    return false;
  }
  
  reviews.splice(index, 1);
  await jsonfile.writeFile(DATA_FILE, reviews, { spaces: 2 });
  return true;
}

/**
 * Gets reviews with filtering and pagination options
 * 
 * @param {Object} options - Query options
 * @param {string} [options.status] - Filter by status
 * @param {number} [options.rating] - Filter by rating
 * @param {string} [options.customerId] - Filter by customer ID
 * @param {number} [options.limit] - Limit number of results
 * @param {number} [options.offset] - Offset for pagination
 * @returns {Promise<Object>} Object with reviews array and total count
 */
export async function getReviewsWithFilters(options = {}) {
  let reviews = await getAllReviews();
  
  // Apply filters
  if (options.status) {
    reviews = reviews.filter(review => review.status === options.status);
  }
  
  if (options.rating) {
    reviews = reviews.filter(review => review.rating === options.rating);
  }
  
  if (options.customerId) {
    reviews = reviews.filter(review => review.customerId === options.customerId);
  }
  
  const total = reviews.length;
  
  // Sort by creation date (newest first)
  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Apply pagination
  if (options.offset) {
    reviews = reviews.slice(options.offset);
  }
  
  if (options.limit) {
    reviews = reviews.slice(0, options.limit);
  }
  
  return {
    reviews,
    total,
    limit: options.limit || total,
    offset: options.offset || 0
  };
}

// Test this service
export async function testDataService() {
  try {
    // Test getting all reviews (should be empty initially)
    const allReviews = await getAllReviews();
    console.assert(Array.isArray(allReviews), 'getAllReviews should return an array');
    
    // Test saving a review
    const testReview = {
      id: 'test_123',
      customerId: 'cust_123',
      customerName: 'Test Customer',
      rating: 5,
      title: 'Test Review',
      comment: 'This is a test',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Data service tests would run here (skipped to avoid modifying files during testing)');
  } catch (error) {
    console.error('Data service test failed:', error);
  }
}