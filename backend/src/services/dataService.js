/**
 * Data storage service for reviews using SQLite database
 * 
 * This service handles CRUD operations for reviews with persistent storage
 * in a SQLite database. Provides better data integrity, concurrency handling,
 * and scalability compared to JSON file storage.
 */

import { getDatabase } from '../data/database.js';

// Get database instance
const db = getDatabase();

// Prepare statements for better performance
const statements = {
  getAllReviews: db.prepare('SELECT * FROM reviews ORDER BY createdAt DESC'),
  getReviewById: db.prepare('SELECT * FROM reviews WHERE id = ?'),
  getReviewsByCustomerId: db.prepare('SELECT * FROM reviews WHERE customerId = ? ORDER BY createdAt DESC'),
  insertReview: db.prepare(`
    INSERT INTO reviews (id, customerId, customerName, rating, title, comment, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateReview: db.prepare(`
    UPDATE reviews 
    SET customerId = ?, customerName = ?, rating = ?, title = ?, comment = ?, status = ?, updatedAt = ?
    WHERE id = ?
  `),
  deleteReview: db.prepare('DELETE FROM reviews WHERE id = ?'),
  getReviewsWithFilters: {
    base: 'SELECT * FROM reviews WHERE 1=1',
    count: 'SELECT COUNT(*) as total FROM reviews WHERE 1=1'
  }
};

/**
 * Reads all reviews from the database
 * 
 * @returns {Array} Array of review objects
 */
export function getAllReviews() {
  try {
    return statements.getAllReviews.all();
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw new Error('Failed to retrieve reviews');
  }
}

/**
 * Finds a review by ID
 * 
 * @param {string} id - Review ID
 * @returns {Object|null} Review object or null if not found
 */
export function getReviewById(id) {
  try {
    return statements.getReviewById.get(id) || null;
  } catch (error) {
    console.error('Error getting review by ID:', error);
    throw new Error('Failed to retrieve review');
  }
}

/**
 * Finds reviews by customer ID
 * 
 * @param {string} customerId - Customer ID
 * @returns {Array} Array of reviews for the customer
 */
export function getReviewsByCustomerId(customerId) {
  try {
    return statements.getReviewsByCustomerId.all(customerId);
  } catch (error) {
    console.error('Error getting reviews by customer ID:', error);
    throw new Error('Failed to retrieve customer reviews');
  }
}

/**
 * Saves a new review to storage
 * 
 * @param {Object} review - Review object to save
 * @returns {Object} Saved review object
 */
export function saveReview(review) {
  try {
    const result = statements.insertReview.run(
      review.id,
      review.customerId,
      review.customerName,
      review.rating,
      review.title,
      review.comment,
      review.status,
      review.createdAt,
      review.updatedAt
    );
    
    if (result.changes === 0) {
      throw new Error('Failed to insert review');
    }
    
    return review;
  } catch (error) {
    console.error('Error saving review:', error);
    throw new Error('Failed to save review');
  }
}

/**
 * Updates an existing review
 * 
 * @param {string} id - Review ID
 * @param {Object} updatedReview - Updated review object
 * @returns {Object|null} Updated review or null if not found
 */
export function updateReviewById(id, updatedReview) {
  try {
    const result = statements.updateReview.run(
      updatedReview.customerId,
      updatedReview.customerName,
      updatedReview.rating,
      updatedReview.title,
      updatedReview.comment,
      updatedReview.status,
      updatedReview.updatedAt,
      id
    );
    
    if (result.changes === 0) {
      return null; // Review not found
    }
    
    return updatedReview;
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }
}

/**
 * Deletes a review by ID
 * 
 * @param {string} id - Review ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteReviewById(id) {
  try {
    const result = statements.deleteReview.run(id);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
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
 * @returns {Object} Object with reviews array and total count
 */
export function getReviewsWithFilters(options = {}) {
  try {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    // Build WHERE clause based on filters
    if (options.status) {
      whereClause += ' AND status = ?';
      params.push(options.status);
    }
    
    if (options.rating) {
      whereClause += ' AND rating = ?';
      params.push(options.rating);
    }
    
    if (options.customerId) {
      whereClause += ' AND customerId = ?';
      params.push(options.customerId);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM reviews ${whereClause}`;
    const countStatement = db.prepare(countQuery);
    const { total } = countStatement.get(...params);
    
    // Build main query with ordering and pagination
    let mainQuery = `SELECT * FROM reviews ${whereClause} ORDER BY createdAt DESC`;
    
    if (options.limit) {
      mainQuery += ' LIMIT ?';
      params.push(options.limit);
    }
    
    if (options.offset) {
      mainQuery += ' OFFSET ?';
      params.push(options.offset);
    }
    
    // Execute main query
    const mainStatement = db.prepare(mainQuery);
    const reviews = mainStatement.all(...params);
    
    return {
      reviews,
      total,
      limit: options.limit || total,
      offset: options.offset || 0
    };
  } catch (error) {
    console.error('Error getting reviews with filters:', error);
    throw new Error('Failed to retrieve filtered reviews');
  }
}

/**
 * Get review statistics
 * 
 * @returns {Object} Statistics object with counts by rating and status
 */
export function getReviewStats() {
  try {
    const ratingStats = db.prepare(`
      SELECT rating, COUNT(*) as count 
      FROM reviews 
      GROUP BY rating 
      ORDER BY rating
    `).all();
    
    const statusStats = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM reviews 
      GROUP BY status
    `).all();
    
    const totalReviews = db.prepare('SELECT COUNT(*) as total FROM reviews').get();
    const avgRating = db.prepare('SELECT AVG(CAST(rating as FLOAT)) as average FROM reviews').get();
    
    return {
      total: totalReviews.total,
      averageRating: avgRating.average ? parseFloat(avgRating.average.toFixed(2)) : 0,
      byRating: ratingStats.reduce((acc, curr) => {
        acc[curr.rating] = curr.count;
        return acc;
      }, {}),
      byStatus: statusStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw new Error('Failed to retrieve review statistics');
  }
}

// Test this service
export function testDataService() {
  try {
    // Test getting all reviews
    const allReviews = getAllReviews();
    console.assert(Array.isArray(allReviews), 'getAllReviews should return an array');
    
    // Test getting stats
    const stats = getReviewStats();
    console.assert(typeof stats.total === 'number', 'stats should have total count');
    console.assert(typeof stats.averageRating === 'number', 'stats should have average rating');
    
    console.log('SQLite data service tests passed');
  } catch (error) {
    console.error('Data service test failed:', error);
  }
}