/**
 * Reviews API routes
 * 
 * Provides REST API endpoints for managing customer reviews:
 * - GET /api/reviews - Get all reviews with optional filters
 * - GET /api/reviews/:id - Get a specific review by ID
 * - POST /api/reviews - Create a new review
 * - PUT /api/reviews/:id - Update an existing review
 * - DELETE /api/reviews/:id - Delete a review
 */

import express from 'express';
import { 
  createReview, 
  updateReview, 
  validateReviewData, 
  validateUpdateData 
} from '../models/review.js';
import {
  getAllReviews,
  getReviewById,
  saveReview,
  updateReviewById,
  deleteReviewById,
  getReviewsWithFilters
} from '../services/dataService.js';

const router = express.Router();

/**
 * GET /api/reviews
 * Get all reviews with optional filtering and pagination
 * 
 * Query parameters:
 * - status: Filter by status (pending, approved, rejected)
 * - rating: Filter by rating (1-5)
 * - customerId: Filter by customer ID
 * - limit: Limit number of results
 * - offset: Offset for pagination
 */
router.get('/', async (req, res) => {
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
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/reviews/:id
 * Get a specific review by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/reviews
 * Create a new review
 * 
 * Required body fields:
 * - customerId: string
 * - customerName: string
 * - rating: number (1-5)
 * - title: string
 * - comment: string
 * 
 * Optional body fields:
 * - status: string (pending, approved, rejected) - defaults to 'pending'
 */
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validation = validateReviewData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }
    
    // Create and save review
    const review = createReview(req.body);
    const savedReview = await saveReview(review);
    
    res.status(201).json({
      success: true,
      data: savedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /api/reviews/:id
 * Update an existing review
 * 
 * Optional body fields (any combination):
 * - customerId: string
 * - customerName: string
 * - rating: number (1-5)
 * - title: string
 * - comment: string
 * - status: string (pending, approved, rejected)
 */
router.put('/:id', async (req, res) => {
  try {
    // Get existing review
    const existingReview = await getReviewById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Validate update data
    const validation = validateUpdateData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }
    
    // Update review
    const updatedReview = updateReview(existingReview, req.body);
    const savedReview = await updateReviewById(req.params.id, updatedReview);
    
    res.json({
      success: true,
      data: savedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * DELETE /api/reviews/:id
 * Delete a review
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteReviewById(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;