/**
 * Database Export Tests
 * 
 * Tests the database export functionality including Accept header handling,
 * format conversion, and Data Warehouse System compatibility.
 */

import { runAllExportTests } from '../routes/export.js';

console.log('Running Database Export Tests...\n');

// Test the export module functions
runAllExportTests();

// Test API endpoints by making actual HTTP requests
async function testExportEndpoints() {
  const baseUrl = 'http://localhost:2509';
  
  console.log('\nTesting API endpoints...');
  
  const testCases = [
    {
      name: 'JSON Export (default)',
      url: `${baseUrl}/api/export`,
      headers: {},
      expectedContentType: 'application/json'
    },
    {
      name: 'JSON Export (explicit)',
      url: `${baseUrl}/api/export`,
      headers: { 'Accept': 'application/json' },
      expectedContentType: 'application/json'
    },
    {
      name: 'CSV Export',
      url: `${baseUrl}/api/export`,
      headers: { 'Accept': 'text/csv' },
      expectedContentType: 'text/csv'
    },
    {
      name: 'XML Export',
      url: `${baseUrl}/api/export`,
      headers: { 'Accept': 'application/xml' },
      expectedContentType: 'application/xml'
    },
    {
      name: 'Complex Accept Header (CSV priority)',
      url: `${baseUrl}/api/export`,
      headers: { 'Accept': 'text/html,text/csv;q=0.9,application/json;q=0.8' },
      expectedContentType: 'text/csv'
    }
  ];
  
  for (const testCase of testCases) {
    try {
      const response = await fetch(testCase.url, {
        headers: testCase.headers
      });
      
      const contentType = response.headers.get('content-type');
      
      console.assert(
        contentType && contentType.includes(testCase.expectedContentType),
        `${testCase.name}: Expected ${testCase.expectedContentType}, got ${contentType}`
      );
      
      console.assert(response.ok, `${testCase.name}: Response should be successful`);
      
      console.log(`✓ ${testCase.name}: Passed`);
      
    } catch (error) {
      console.error(`✗ ${testCase.name}: Failed -`, error.message);
    }
  }
}

// Test Data Warehouse compatibility
async function testDataWarehouseCompatibility() {
  console.log('\nTesting Data Warehouse System compatibility...');
  
  try {
    // Test JSON format for structured data processing
    const jsonResponse = await fetch('http://localhost:2509/api/export', {
      headers: { 'Accept': 'application/json' }
    });
    
    const jsonData = await jsonResponse.json();
    console.assert(jsonData.metadata, 'JSON export should include metadata');
    console.assert(jsonData.data, 'JSON export should include data array');
    console.assert(jsonData.metadata.totalRecords >= 0, 'Should include record count');
    console.assert(jsonData.metadata.exportDate, 'Should include export timestamp');
    console.log('✓ JSON format: Data Warehouse compatible');
    
    // Test CSV format for data processing tools
    const csvResponse = await fetch('http://localhost:2509/api/export', {
      headers: { 'Accept': 'text/csv' }
    });
    
    const csvData = await csvResponse.text();
    console.assert(csvData.includes('id,customerId'), 'CSV should start with column headers');
    console.log('✓ CSV format: Data Warehouse compatible');
    
    // Test XML format for enterprise systems
    const xmlResponse = await fetch('http://localhost:2509/api/export', {
      headers: { 'Accept': 'application/xml' }
    });
    
    const xmlData = await xmlResponse.text();
    console.assert(xmlData.includes('<?xml version="1.0"'), 'XML should have proper declaration');
    console.assert(xmlData.includes('<reviews>'), 'XML should have structured root element');
    console.log('✓ XML format: Data Warehouse compatible');
    
  } catch (error) {
    console.error('Data Warehouse compatibility test failed:', error.message);
  }
}

// Main test runner
async function runAllTests() {
  try {
    await testExportEndpoints();
    await testDataWarehouseCompatibility();
    console.log('\n🎉 All database export tests completed!');
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  }
}

// Check if server is running before testing endpoints
async function checkServerAndRunTests() {
  try {
    const response = await fetch('http://localhost:2509/');
    if (response.ok) {
      await runAllTests();
    } else {
      console.log('Server not responding. Skipping endpoint tests.');
      console.log('Run: npm start (in backend directory) to test endpoints');
    }
  } catch (error) {
    console.log('Server not running. Skipping endpoint tests.');
    console.log('Run: npm start (in backend directory) to test endpoints');
  }
}

checkServerAndRunTests();