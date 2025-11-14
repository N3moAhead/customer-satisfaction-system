/**
 * Seed sample data for customer satisfaction dashboard
 * 
 * Generates realistic customer review data spread across multiple days
 * to populate dashboard charts with meaningful metrics.
 */

import { getDatabase } from './database.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate sample customer review data
 * 
 * Creates reviews across the last 30 days with realistic patterns:
 * - More reviews on weekdays than weekends
 * - Mix of ratings from 1-5 stars with normal distribution
 * - Various statuses (pending, approved, rejected)
 * 
 * @param {number} daysBack - Number of days back to generate data for
 * @returns {Array} Array of review objects
 */
function generateSampleReviews(daysBack = 30) {
  const reviews = [];
  const customers = [
    { id: 'cust_001', name: 'Alice Johnson' },
    { id: 'cust_002', name: 'Bob Smith' },
    { id: 'cust_003', name: 'Carol Davis' },
    { id: 'cust_004', name: 'David Wilson' },
    { id: 'cust_005', name: 'Emma Brown' },
    { id: 'cust_006', name: 'Frank Miller' },
    { id: 'cust_007', name: 'Grace Taylor' },
    { id: 'cust_008', name: 'Henry Clark' },
    { id: 'cust_009', name: 'Ivy Anderson' },
    { id: 'cust_010', name: 'Jack Thompson' },
    { id: 'cust_011', name: 'Kate Martinez' },
    { id: 'cust_012', name: 'Liam Garcia' },
    { id: 'cust_013', name: 'Maya Rodriguez' },
    { id: 'cust_014', name: 'Noah Lopez' },
    { id: 'cust_015', name: 'Olivia Gonzalez' },
    { id: 'cust_016', name: 'Peter Hernandez' },
    { id: 'cust_017', name: 'Quinn Perez' },
    { id: 'cust_018', name: 'Ruby Sanchez' },
    { id: 'cust_019', name: 'Sam Ramirez' },
    { id: 'cust_020', name: 'Tina Cruz' }
  ];

  const reviewTemplates = {
    5: [
      { title: 'Outstanding service!', comment: 'The product quality exceeded my expectations and the customer service was excellent.' },
      { title: 'Highly recommended!', comment: 'Amazing experience from start to finish. Will definitely order again.' },
      { title: 'Perfect!', comment: 'Everything was exactly as described. Fast shipping and great packaging.' },
      { title: 'Excellent quality', comment: 'The product is well-made and arrived quickly. Very satisfied with my purchase.' },
      { title: 'Great value', comment: 'High quality product at a reasonable price. Customer service was very helpful.' }
    ],
    4: [
      { title: 'Good experience', comment: 'Overall satisfied with the purchase. Fast delivery and good packaging.' },
      { title: 'Solid product', comment: 'Good quality product, though delivery took a bit longer than expected.' },
      { title: 'Recommended', comment: 'Good value for money. The product meets my expectations.' },
      { title: 'Happy customer', comment: 'Product works well and customer service was responsive.' },
      { title: 'Good service', comment: 'Pleasant ordering experience with quick resolution of a minor issue.' }
    ],
    3: [
      { title: 'Average product', comment: 'The product is okay but could be improved. Customer service was helpful though.' },
      { title: 'Mixed feelings', comment: 'Some aspects are good, others could be better. Decent overall experience.' },
      { title: 'Acceptable', comment: 'Product works as advertised but nothing special. Average experience.' },
      { title: 'It\'s fine', comment: 'Does what it\'s supposed to do. No major complaints but nothing outstanding.' },
      { title: 'Could be better', comment: 'Product is functional but I expected more for the price.' }
    ],
    2: [
      { title: 'Disappointing', comment: 'Product quality was lower than expected. Shipping was delayed.' },
      { title: 'Not as described', comment: 'The product doesn\'t match the description. Had to contact support.' },
      { title: 'Poor quality', comment: 'Product feels cheap and doesn\'t work as well as advertised.' },
      { title: 'Underwhelming', comment: 'Expected better quality. Customer service was slow to respond.' },
      { title: 'Issues with delivery', comment: 'Product is okay but delivery was problematic and took too long.' }
    ],
    1: [
      { title: 'Terrible experience', comment: 'Product arrived damaged and customer service was unresponsive.' },
      { title: 'Complete waste', comment: 'Product doesn\'t work at all. Requesting a full refund.' },
      { title: 'Worst purchase ever', comment: 'Poor quality, late delivery, and terrible customer service.' },
      { title: 'Avoid this', comment: 'Save your money. Product is completely useless and support is non-existent.' },
      { title: 'Extremely disappointed', comment: 'Nothing about this purchase went right. Very poor experience overall.' }
    ]
  };

  const statuses = ['pending', 'approved', 'rejected'];
  const statusWeights = [0.4, 0.5, 0.1]; // 40% pending, 50% approved, 10% rejected

  // Generate reviews for each day
  for (let dayOffset = 0; dayOffset < daysBack; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    
    // Weekend factor - fewer reviews on weekends
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendFactor = isWeekend ? 0.3 : 1.0;
    
    // Base reviews per day with some randomness
    const baseReviews = Math.floor((Math.random() * 8 + 2) * weekendFactor); // 2-10 reviews per day, fewer on weekends
    
    for (let i = 0; i < baseReviews; i++) {
      // Random customer
      const customer = customers[Math.floor(Math.random() * customers.length)];
      
      // Generate rating with normal distribution favoring higher ratings
      let rating;
      const rand = Math.random();
      if (rand < 0.35) rating = 5;
      else if (rand < 0.65) rating = 4;
      else if (rand < 0.80) rating = 3;
      else if (rand < 0.93) rating = 2;
      else rating = 1;
      
      // Select random template for this rating
      const templates = reviewTemplates[rating];
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      // Select status based on weights
      let status = 'pending';
      const statusRand = Math.random();
      let cumWeight = 0;
      for (let j = 0; j < statuses.length; j++) {
        cumWeight += statusWeights[j];
        if (statusRand < cumWeight) {
          status = statuses[j];
          break;
        }
      }
      
      // Random time within the day
      const reviewTime = new Date(date);
      reviewTime.setHours(
        Math.floor(Math.random() * 16) + 8, // 8 AM to 11 PM
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );
      
      const review = {
        id: uuidv4(),
        customerId: customer.id,
        customerName: customer.name,
        rating,
        title: template.title,
        comment: template.comment,
        status,
        createdAt: reviewTime.toISOString(),
        updatedAt: reviewTime.toISOString()
      };
      
      reviews.push(review);
    }
  }
  
  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Seed the database with sample review data
 * 
 * @param {number} daysBack - Number of days back to generate data for
 * @returns {Object} Results of the seeding operation
 */
export function seedDatabase(daysBack = 30) {
  const db = getDatabase();
  
  try {
    // Clear existing reviews (optional - comment out to keep existing data)
    // db.prepare('DELETE FROM reviews').run();
    
    // Generate sample reviews
    const reviews = generateSampleReviews(daysBack);
    
    // Prepare insert statement
    const insertReview = db.prepare(`
      INSERT OR REPLACE INTO reviews (
        id, customerId, customerName, rating, title, comment, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Insert all reviews in a transaction for better performance
    const insertMany = db.transaction((reviewList) => {
      for (const review of reviewList) {
        insertReview.run(
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
      }
    });
    
    insertMany(reviews);
    
    // Get stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as totalReviews,
        COUNT(DISTINCT customerId) as uniqueCustomers,
        AVG(rating) as avgRating,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        MIN(DATE(createdAt)) as earliestDate,
        MAX(DATE(createdAt)) as latestDate
      FROM reviews
    `).get();
    
    console.log('Database seeded successfully!');
    console.log(`Added ${reviews.length} new reviews`);
    console.log('Stats:', {
      ...stats,
      avgRating: Math.round(stats.avgRating * 100) / 100
    });
    
    return {
      success: true,
      reviewsAdded: reviews.length,
      stats
    };
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear all review data from database
 */
export function clearReviews() {
  const db = getDatabase();
  
  try {
    const result = db.prepare('DELETE FROM reviews').run();
    console.log(`Cleared ${result.changes} reviews from database`);
    return { success: true, cleared: result.changes };
  } catch (error) {
    console.error('Error clearing reviews:', error);
    throw error;
  }
}

// Test this seeding functionality
export function testSeedData() {
  try {
    console.log('Testing sample review generation...');
    const sampleReviews = generateSampleReviews(5);
    
    console.assert(Array.isArray(sampleReviews), 'Should return an array');
    console.assert(sampleReviews.length > 0, 'Should generate some reviews');
    
    if (sampleReviews.length > 0) {
      const review = sampleReviews[0];
      const requiredFields = ['id', 'customerId', 'customerName', 'rating', 'title', 'comment', 'status', 'createdAt', 'updatedAt'];
      
      requiredFields.forEach(field => {
        console.assert(review.hasOwnProperty(field), `Review should have ${field} field`);
      });
      
      console.assert(review.rating >= 1 && review.rating <= 5, 'Rating should be between 1 and 5');
      console.assert(['pending', 'approved', 'rejected'].includes(review.status), 'Status should be valid');
    }
    
    console.log('Sample data generation test passed!');
    return true;
    
  } catch (error) {
    console.error('Sample data test failed:', error);
    return false;
  }
}