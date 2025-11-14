/**
 * Migration script to transfer existing JSON data to SQLite database
 * 
 * This script reads the existing reviews.json file and imports all
 * reviews into the SQLite database. Run this once during the migration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database.js';
import { saveReview } from '../services/dataService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file
const JSON_FILE = path.join(__dirname, 'reviews.json');

/**
 * Migrate JSON data to SQLite database
 * 
 * @returns {Object} Migration result with counts
 */
export function migrateJsonToSqlite() {
  console.log('Starting migration from JSON to SQLite...');
  
  try {
    // Initialize database (creates tables if needed)
    initializeDatabase();
    console.log('Database initialized');
    
    // Check if JSON file exists
    if (!fs.existsSync(JSON_FILE)) {
      console.log('No JSON file found, nothing to migrate');
      return { migrated: 0, errors: 0 };
    }
    
    // Read JSON file
    const jsonData = fs.readFileSync(JSON_FILE, 'utf8');
    const reviews = JSON.parse(jsonData);
    
    if (!Array.isArray(reviews)) {
      throw new Error('JSON file does not contain an array of reviews');
    }
    
    console.log(`Found ${reviews.length} reviews to migrate`);
    
    let migratedCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Migrate each review
    for (const review of reviews) {
      try {
        // Validate required fields
        if (!review.id || !review.customerId || !review.customerName || 
            !review.rating || !review.title || !review.comment) {
          throw new Error(`Invalid review data: missing required fields`);
        }
        
        // Save to SQLite
        saveReview(review);
        migratedCount++;
        console.log(`Migrated review ${review.id} (${migratedCount}/${reviews.length})`);
        
      } catch (error) {
        errorCount++;
        const errorMsg = `Failed to migrate review ${review.id || 'unknown'}: ${error.message}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
    
    console.log(`Migration completed: ${migratedCount} reviews migrated, ${errorCount} errors`);
    
    if (errors.length > 0) {
      console.log('Errors encountered:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    return { 
      migrated: migratedCount, 
      errors: errorCount,
      errorDetails: errors 
    };
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Backup JSON file after successful migration
 */
export function backupJsonFile() {
  try {
    if (!fs.existsSync(JSON_FILE)) {
      console.log('No JSON file to backup');
      return;
    }
    
    const backupFile = JSON_FILE.replace('.json', '.json.backup');
    fs.copyFileSync(JSON_FILE, backupFile);
    console.log(`JSON file backed up to: ${backupFile}`);
    
  } catch (error) {
    console.error('Failed to backup JSON file:', error);
    throw error;
  }
}

/**
 * Run the complete migration process
 */
export function runMigration() {
  try {
    const result = migrateJsonToSqlite();
    
    if (result.migrated > 0 && result.errors === 0) {
      backupJsonFile();
      console.log('Migration completed successfully!');
    } else if (result.migrated > 0) {
      console.log(`Migration completed with ${result.errors} errors. Check logs above.`);
    } else {
      console.log('No data was migrated.');
    }
    
    return result;
    
  } catch (error) {
    console.error('Migration process failed:', error);
    throw error;
  }
}

// Test migration (dry run)
export function testMigration() {
  try {
    console.log('Testing migration process...');
    
    // Check if JSON file exists and is readable
    if (fs.existsSync(JSON_FILE)) {
      const jsonData = fs.readFileSync(JSON_FILE, 'utf8');
      const reviews = JSON.parse(jsonData);
      console.log(`Found ${reviews.length} reviews in JSON file`);
      
      // Validate first review structure
      if (reviews.length > 0) {
        const firstReview = reviews[0];
        const requiredFields = ['id', 'customerId', 'customerName', 'rating', 'title', 'comment'];
        const hasAllFields = requiredFields.every(field => firstReview[field] !== undefined);
        console.log(`First review has all required fields: ${hasAllFields}`);
      }
    } else {
      console.log('No JSON file found for migration');
    }
    
    // Test database connection
    initializeDatabase();
    console.log('Database connection successful');
    
    console.log('Migration test completed successfully');
    
  } catch (error) {
    console.error('Migration test failed:', error);
    throw error;
  }
}

// If this script is run directly, execute the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}