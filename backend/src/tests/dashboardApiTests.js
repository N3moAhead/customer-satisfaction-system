/**
 * Test script for the new dashboard API endpoints
 * 
 * Run this to verify all endpoints are working correctly:
 * node backend/src/tests/dashboardApiTests.js
 */

import { testDailyMetricsCalculation } from '../routes/metrics.js';
import { testDetailsTransformation } from '../routes/usage.js';
import { testCSVConversion } from '../routes/export.js';

console.log('Running Dashboard API Tests...\n');

// Test metrics calculations
console.log('1. Testing daily metrics calculation...');
try {
  testDailyMetricsCalculation();
  console.log('✅ Daily metrics calculation test passed\n');
} catch (error) {
  console.log('❌ Daily metrics calculation test failed:', error.message);
}

// Test details transformation
console.log('2. Testing details transformation...');
try {
  testDetailsTransformation();
  console.log('✅ Details transformation test passed\n');
} catch (error) {
  console.log('❌ Details transformation test failed:', error.message);
}

// Test CSV conversion (existing)
console.log('3. Testing CSV conversion...');
try {
  testCSVConversion();
  console.log('✅ CSV conversion test passed\n');
} catch (error) {
  console.log('❌ CSV conversion test failed:', error.message);
}

console.log('All tests completed!');

// Test API endpoints if server is running
console.log('\n4. Testing live API endpoints...');

async function testAPIEndpoints() {
  const baseURL = 'http://localhost:2509';
  
  const endpoints = [
    '/api/metrics/timeseries?startDate=2025-11-07&endDate=2025-11-07',
    '/api/metrics/summary?startDate=2025-11-07&endDate=2025-11-07&comparison=none',
    '/api/usage/details?limit=2',
    '/api/usage/summary'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(baseURL + endpoint);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ ${endpoint} - OK`);
      } else {
        console.log(`❌ ${endpoint} - Error: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Connection failed (server not running?)`);
    }
  }
}

// Only test endpoints if fetch is available (Node 18+)
if (typeof fetch !== 'undefined') {
  await testAPIEndpoints();
} else {
  console.log('Skipping live API tests (fetch not available - use Node 18+)');
}

console.log('\nDashboard API Tests Complete! 🎉');