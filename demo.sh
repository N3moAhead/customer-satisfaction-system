#!/bin/bash

# Customer Satisfaction System API Demo
# This script demonstrates all the API functionality

echo "🚀 Customer Satisfaction System API Demo"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_BASE="http://localhost:2509/api"

echo -e "${BLUE}Starting server...${NC}"
cd backend && npm start &
SERVER_PID=$!
sleep 3

echo -e "${GREEN}✓ Server started on http://localhost:2509${NC}"
echo ""

# Test 1: Create reviews
echo -e "${YELLOW}1. Creating sample reviews...${NC}"
curl -s -X POST "$API_BASE/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_001",
    "customerName": "Alice Johnson",
    "rating": 5,
    "title": "Outstanding service!",
    "comment": "The product quality exceeded my expectations and the customer service was excellent."
  }' | jq '.'

curl -s -X POST "$API_BASE/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_002",
    "customerName": "Bob Smith",
    "rating": 4,
    "title": "Good experience",
    "comment": "Overall satisfied with the purchase. Fast delivery and good packaging."
  }' | jq '.'

curl -s -X POST "$API_BASE/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_003",
    "customerName": "Carol Davis",
    "rating": 3,
    "title": "Average product",
    "comment": "The product is okay but could be improved. Customer service was helpful though."
  }' | jq '.'

echo -e "${GREEN}✓ Sample reviews created${NC}"
echo ""

# Test 2: Get all reviews
echo -e "${YELLOW}2. Getting all reviews...${NC}"
curl -s "$API_BASE/reviews" | jq '.data.reviews[] | {id, customerName, rating, title, status}'
echo ""

# Test 3: Filter reviews
echo -e "${YELLOW}3. Getting reviews with rating >= 4...${NC}"
curl -s "$API_BASE/reviews?rating=4" | jq '.data.reviews[] | {customerName, rating, title}'
curl -s "$API_BASE/reviews?rating=5" | jq '.data.reviews[] | {customerName, rating, title}'
echo ""

# Test 4: Get summary statistics  
echo -e "${YELLOW}4. Getting summary statistics...${NC}"
curl -s "$API_BASE/export/summary" | jq '.data'
echo ""

# Test 5: Update a review (get first review ID)
echo -e "${YELLOW}5. Updating first review status to 'approved'...${NC}"
REVIEW_ID=$(curl -s "$API_BASE/reviews" | jq -r '.data.reviews[0].id')
curl -s -X PUT "$API_BASE/reviews/$REVIEW_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}' | jq '.data | {id, customerName, status, updatedAt}'
echo ""

# Test 6: Export data
echo -e "${YELLOW}6. Exporting data...${NC}"
echo "JSON export (first review):"
curl -s "$API_BASE/export/json" | jq '.data[0] | {customerName, rating, title, status}'

echo ""
echo "CSV export preview:"
curl -s "$API_BASE/export/csv" | head -2
echo ""

# Test 7: Error handling
echo -e "${YELLOW}7. Testing error handling...${NC}"
echo "Attempting to get non-existent review:"
curl -s "$API_BASE/reviews/non-existent-id" | jq '.'
echo ""

echo "Attempting to create invalid review:"
curl -s -X POST "$API_BASE/reviews" \
  -H "Content-Type: application/json" \
  -d '{"rating": 6}' | jq '.'
echo ""

# Cleanup
echo -e "${BLUE}Cleaning up...${NC}"
kill $SERVER_PID

echo -e "${GREEN}✅ Demo completed successfully!${NC}"
echo ""
echo "To start the server manually: cd backend && npm start"
echo "API documentation: backend/API_DOCUMENTATION.md"
echo "Run tests: cd backend && npm test"