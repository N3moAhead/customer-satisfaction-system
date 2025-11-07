# Customer Satisfaction System API

This REST API provides endpoints for managing customer reviews and exporting data.

## Base URL
```
http://localhost:2509/api
```

## Reviews Endpoints

### GET /reviews
Get all reviews with optional filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `approved`, `rejected`)
- `rating` (optional): Filter by rating (1-5)
- `customerId` (optional): Filter by customer ID
- `limit` (optional): Limit number of results
- `offset` (optional): Offset for pagination

**Example:**
```bash
curl "http://localhost:2509/api/reviews?status=approved&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "total": 50,
    "limit": 10,
    "offset": 0
  }
}
```

### GET /reviews/:id
Get a specific review by ID.

**Example:**
```bash
curl "http://localhost:2509/api/reviews/123e4567-e89b-12d3-a456-426614174000"
```

### POST /reviews
Create a new review.

**Required Fields:**
- `customerId`: Customer identifier (string)
- `customerName`: Customer's name (string)
- `rating`: Rating from 1-5 (number)
- `title`: Review title (string)
- `comment`: Review text (string)

**Optional Fields:**
- `status`: Review status - defaults to 'pending' (string)

**Example:**
```bash
curl -X POST "http://localhost:2509/api/reviews" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerId": "cust_123",
    "customerName": "John Doe",
    "rating": 5,
    "title": "Great service!",
    "comment": "I was very satisfied with the product."
  }'
```

### PUT /reviews/:id
Update an existing review.

**Optional Fields (any combination):**
- `customerId`: Customer identifier (string)
- `customerName`: Customer's name (string)
- `rating`: Rating from 1-5 (number)
- `title`: Review title (string)
- `comment`: Review text (string)
- `status`: Review status (string)

**Example:**
```bash
curl -X PUT "http://localhost:2509/api/reviews/123e4567-e89b-12d3-a456-426614174000" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "approved",
    "rating": 4
  }'
```

### DELETE /reviews/:id
Delete a review.

**Example:**
```bash
curl -X DELETE "http://localhost:2509/api/reviews/123e4567-e89b-12d3-a456-426614174000"
```

## Export Endpoints

### GET /export/csv
Export reviews as CSV file. Supports the same query parameters as GET /reviews.

**Example:**
```bash
curl "http://localhost:2509/api/export/csv?status=approved" -o reviews.csv
```

### GET /export/json
Export reviews as JSON file. Supports the same query parameters as GET /reviews.

**Example:**
```bash
curl "http://localhost:2509/api/export/json" -o reviews.json
```

### GET /export/summary
Get summary statistics for all reviews.

**Example:**
```bash
curl "http://localhost:2509/api/export/summary"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReviews": 100,
    "averageRating": 4.2,
    "statusBreakdown": {
      "pending": 20,
      "approved": 70,
      "rejected": 10
    },
    "ratingBreakdown": {
      "1": 5,
      "2": 10,
      "3": 15,
      "4": 30,
      "5": 40
    },
    "generatedAt": "2023-01-01T10:00:00Z"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": ["Detailed error messages for validation errors"]
}
```

## Status Codes
- `200`: Success
- `201`: Created (for POST requests)
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Review Schema

```javascript
{
  id: "123e4567-e89b-12d3-a456-426614174000",
  customerId: "cust_123",
  customerName: "John Doe",
  rating: 5,
  title: "Great service!",
  comment: "I was very satisfied with the product.",
  status: "pending", // "pending" | "approved" | "rejected"
  createdAt: "2023-01-01T10:00:00Z",
  updatedAt: "2023-01-01T10:00:00Z"
}
```