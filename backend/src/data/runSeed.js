/**
 * Seed database script
 * 
 * Run this script to populate the database with sample customer review data
 * for testing the dashboard functionality.
 * 
 * Usage: node src/data/runSeed.js
 */

import { seedDatabase, testSeedData } from './seedData.js';

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Run tests first
    console.log('Running tests...');
    const testPassed = testSeedData();
    if (!testPassed) {
      console.error('❌ Tests failed, aborting seed');
      process.exit(1);
    }
    
    // Seed the database
    const result = await seedDatabase(30); // Generate 30 days of data
    
    if (result.success) {
      console.log('✅ Database seeding completed successfully!');
      console.log(`📊 Generated ${result.reviewsAdded} reviews`);
      console.log('📈 Database stats:', result.stats);
      console.log('\n🚀 You can now view the dashboard with populated data');
    } else {
      console.error('❌ Database seeding failed');
    }
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();