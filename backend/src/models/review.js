/**
 * Review data model and validation functions
 * 
 * Review schema (matches SQLite database schema):
 * - id: unique identifier (string, PRIMARY KEY)
 * - customerId: customer identifier (string, NOT NULL)
 * - customerName: customer's name (string, NOT NULL)
 * - rating: review rating from 1-5 (number, CHECK constraint)
 * - title: review title (string, NOT NULL)
 * - comment: review text (string, NOT NULL)
 * - createdAt: creation timestamp (ISO string, NOT NULL)
 * - updatedAt: last update timestamp (ISO string, NOT NULL)
 * - status: review status - 'pending', 'approved', 'rejected' (string, CHECK constraint)
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new review object with default values
 * 
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.customerId - Customer identifier
 * @param {string} reviewData.customerName - Customer's name
 * @param {number} reviewData.rating - Rating from 1-5
 * @param {string} reviewData.title - Review title
 * @param {string} reviewData.comment - Review text
 * @param {string} [reviewData.status='pending'] - Review status
 * @returns {Object} New review object with generated id and timestamps
 */
export function createReview(reviewData) {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    customerId: reviewData.customerId,
    customerName: reviewData.customerName,
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment,
    status: reviewData.status || 'pending',
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Updates a review object with new data and timestamp
 * 
 * @param {Object} existingReview - Existing review object
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated review object
 */
export function updateReview(existingReview, updateData) {
  return {
    ...existingReview,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Validates review data for creation
 * 
 * @param {Object} reviewData - Review data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateReviewData(reviewData) {
  const errors = [];
  
  // Required fields
  if (!reviewData.customerId || typeof reviewData.customerId !== 'string') {
    errors.push('customerId is required and must be a string');
  }
  
  if (!reviewData.customerName || typeof reviewData.customerName !== 'string') {
    errors.push('customerName is required and must be a string');
  }
  
  if (!reviewData.title || typeof reviewData.title !== 'string') {
    errors.push('title is required and must be a string');
  }
  
  if (!reviewData.comment || typeof reviewData.comment !== 'string') {
    errors.push('comment is required and must be a string');
  }
  
  // Rating validation
  if (reviewData.rating === undefined || reviewData.rating === null) {
    errors.push('rating is required');
  } else if (typeof reviewData.rating !== 'number' || reviewData.rating < 1 || reviewData.rating > 5) {
    errors.push('rating must be a number between 1 and 5');
  }
  
  // Status validation (if provided)
  if (reviewData.status && !['pending', 'approved', 'rejected'].includes(reviewData.status)) {
    errors.push('status must be one of: pending, approved, rejected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates review data for updates (all fields optional)
 * 
 * @param {Object} updateData - Update data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateUpdateData(updateData) {
  const errors = [];
  
  // Optional field validations
  if (updateData.customerId !== undefined && typeof updateData.customerId !== 'string') {
    errors.push('customerId must be a string');
  }
  
  if (updateData.customerName !== undefined && typeof updateData.customerName !== 'string') {
    errors.push('customerName must be a string');
  }
  
  if (updateData.title !== undefined && typeof updateData.title !== 'string') {
    errors.push('title must be a string');
  }
  
  if (updateData.comment !== undefined && typeof updateData.comment !== 'string') {
    errors.push('comment must be a string');
  }
  
  if (updateData.rating !== undefined && 
      (typeof updateData.rating !== 'number' || updateData.rating < 1 || updateData.rating > 5)) {
    errors.push('rating must be a number between 1 and 5');
  }
  
  if (updateData.status !== undefined && 
      !['pending', 'approved', 'rejected'].includes(updateData.status)) {
    errors.push('status must be one of: pending, approved, rejected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Test these functions
export function testReviewModel() {
  // Test valid review creation
  const validReview = {
    customerId: 'cust_123',
    customerName: 'John Doe',
    rating: 5,
    title: 'Great service!',
    comment: 'I was very satisfied with the product.'
  };
  
  const review = createReview(validReview);
  console.assert(review.id, 'Review should have an ID');
  console.assert(review.createdAt, 'Review should have createdAt timestamp');
  console.assert(review.status === 'pending', 'Review should default to pending status');
  
  // Test validation
  const validation = validateReviewData(validReview);
  console.assert(validation.isValid === true, 'Valid review should pass validation');
  
  // Test invalid review
  const invalidReview = { rating: 6 };
  const invalidValidation = validateReviewData(invalidReview);
  console.assert(invalidValidation.isValid === false, 'Invalid review should fail validation');
  console.assert(invalidValidation.errors.length > 0, 'Invalid review should have errors');
  
  console.log('Review model tests passed!');
}