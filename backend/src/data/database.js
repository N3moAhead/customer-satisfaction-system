/**
 * SQLite database initialization and schema setup
 * 
 * This module handles database connection, schema creation, and provides
 * a centralized database instance for the application.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path - stored in the data directory
const DB_FILE = path.join(__dirname, 'reviews.db');

// Create database connection with proper settings
const db = new Database(DB_FILE, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

/**
 * Initialize database schema
 * Creates the reviews table if it doesn't exist
 */
function initializeSchema() {
  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_reviews_customerId ON reviews(customerId);
    CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
    CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
    CREATE INDEX IF NOT EXISTS idx_reviews_createdAt ON reviews(createdAt);
  `;

  try {
    db.exec(createReviewsTable);
    db.exec(createIndexes);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

/**
 * Get database instance
 * 
 * @returns {Database} SQLite database instance
 */
export function getDatabase() {
  return db;
}

/**
 * Initialize the database
 * Sets up schema and returns database instance
 * 
 * @returns {Database} SQLite database instance
 */
export function initializeDatabase() {
  initializeSchema();
  return db;
}

/**
 * Close database connection
 * Should be called when shutting down the application
 */
export function closeDatabase() {
  try {
    db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
  }
}

/**
 * Check if database is healthy
 * 
 * @returns {boolean} True if database is accessible
 */
export function isDatabaseHealthy() {
  try {
    const result = db.prepare('SELECT 1 as test').get();
    return result.test === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Initialize schema on module load
initializeSchema();

// Test this database module
export function testDatabase() {
  try {
    console.assert(isDatabaseHealthy(), 'Database should be healthy');
    
    // Test table exists
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='reviews'
    `).all();
    
    console.assert(tables.length === 1, 'Reviews table should exist');
    console.log('Database tests passed');
  } catch (error) {
    console.error('Database test failed:', error);
  }
}