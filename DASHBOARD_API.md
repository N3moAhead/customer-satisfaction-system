# Dashboard API Documentation

## Overview

The Dashboard API provides endpoints to support the customer satisfaction dashboard with analytics, metrics, and detailed data views. All endpoints return JSON responses with a consistent structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... } // Optional metadata
}
```

## Metrics Endpoints

### GET /api/metrics/timeseries

Get time-series metrics data for dashboard charts.

**Query Parameters:**
- `startDate` (string, optional): Start date in YYYY-MM-DD format. Defaults to 30 days ago.
- `endDate` (string, optional): End date in YYYY-MM-DD format. Defaults to today.
- `metrics` (string, optional): Comma-separated list of specific metrics to include.

**Available Metrics:**
- `Reviews submitted`: Total reviews submitted per day
- `Reviews approved`: Reviews approved per day
- `Reviews pending`: Reviews pending approval per day
- `Reviews rejected`: Reviews rejected per day
- `Average rating`: Average rating per day
- `5-star reviews`: Number of 5-star reviews per day
- `Customer interactions`: Total customer interactions per day
- `Support escalations`: Reviews requiring support attention (rating ≤ 2)

**Example Request:**
```bash
GET /api/metrics/timeseries?startDate=2025-11-01&endDate=2025-11-07&metrics=Reviews submitted,Average rating
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-11-07",
      "Reviews submitted": 5,
      "Average rating": 4.4
    }
  ],
  "meta": {
    "startDate": "2025-11-01",
    "endDate": "2025-11-07",
    "requestedMetrics": ["Reviews submitted", "Average rating"]
  }
}
```

### GET /api/metrics/summary

Get KPI summary with period comparisons.

**Query Parameters:**
- `startDate` (string, optional): Current period start date
- `endDate` (string, optional): Current period end date
- `comparison` (string, optional): Comparison type - `previous_period`, `last_year`, or `none`. Default: `previous_period`

**Example Request:**
```bash
GET /api/metrics/summary?startDate=2025-11-07&endDate=2025-11-07&comparison=none
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-11-07T00:00:00.000Z",
      "endDate": "2025-11-07T23:59:59.999Z"
    },
    "metrics": {
      "totalReviews": 5,
      "averageRating": 4.4,
      "satisfactionScore": 80,
      "statusBreakdown": {
        "pending": 4,
        "approved": 1
      },
      "ratingBreakdown": {
        "3": 1,
        "4": 1,
        "5": 3
      },
      "customerSentiment": {
        "positive": 4,
        "neutral": 1,
        "negative": 0
      }
    },
    "comparison": null,
    "generatedAt": "2025-11-07T15:30:00.000Z"
  }
}
```

## Usage Endpoints

### GET /api/usage/details

Get detailed records for the dashboard data table with filtering, sorting, and pagination.

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`)
- `rating` (number, optional): Filter by rating (1-5)
- `customerId` (string, optional): Filter by customer ID
- `owner` (string, optional): Filter by customer name
- `region` (string, optional): Filter by region
- `stability` (string, optional): Filter by stability (`Stable`, `Warning`, `Critical`)
- `sentiment` (string, optional): Filter by sentiment (`Positive`, `Neutral`, `Negative`)
- `priority` (string, optional): Filter by priority (`High`, `Medium`, `Low`)
- `search` (string, optional): Search term for title, comment, or customer name
- `limit` (number, optional): Number of records per page. Default: 50
- `offset` (number, optional): Pagination offset. Default: 0
- `sortBy` (string, optional): Field to sort by. Default: `createdAt`
- `sortOrder` (string, optional): Sort order (`asc`, `desc`). Default: `desc`

**Example Request:**
```bash
GET /api/usage/details?sentiment=Positive&limit=2&sortBy=rating&sortOrder=desc
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "b465e633-7d5a-4e14-8c0c-ce9bae794874",
        "owner": "John Doe",
        "customerId": "cust_123",
        "status": "pending",
        "rating": 5,
        "title": "Excellent service!",
        "comment": "Very satisfied with the product quality.",
        "costs": "$29.95",
        "region": "US-West",
        "stability": "Stable",
        "lastEdited": "2025-11-07T14:38:08.372Z",
        "createdAt": "2025-11-07T14:38:08.372Z",
        "sentiment": "Positive",
        "priority": "Low"
      }
    ],
    "pagination": {
      "total": 4,
      "limit": 2,
      "offset": 0,
      "hasMore": true
    },
    "statistics": {
      "total": 4,
      "statusBreakdown": { "pending": 3, "approved": 1 },
      "sentimentBreakdown": { "Positive": 4 },
      "stabilityBreakdown": { "Stable": 4 },
      "regionBreakdown": { "US-West": 2, "EU-Central": 1, "Asia-Pacific": 1 },
      "averageRating": 4.75
    }
  }
}
```

### GET /api/usage/summary

Get summary statistics for usage/details.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalRecords": 5,
    "statusBreakdown": { "pending": 4, "approved": 1 },
    "sentimentBreakdown": { "Positive": 4, "Neutral": 1 },
    "stabilityBreakdown": { "Stable": 4, "Warning": 1 },
    "regionBreakdown": { "US-West": 2, "EU-Central": 2, "Asia-Pacific": 1 },
    "priorityBreakdown": { "Low": 4, "Medium": 1 },
    "averageRating": 4.4,
    "generatedAt": "2025-11-07T15:30:00.000Z"
  }
}
```

## Data Mappings

### Customer Satisfaction to Dashboard Metrics

The system maps customer satisfaction review data to dashboard-friendly metrics:

**Review Status → Stability:**
- Rating 4-5: `Stable`
- Rating 3: `Warning`  
- Rating 1-2: `Critical`

**Review Rating → Sentiment:**
- Rating 4-5: `Positive`
- Rating 3: `Neutral`
- Rating 1-2: `Negative`

**Review Rating → Priority:**
- Rating 1-2: `High` (needs immediate attention)
- Rating 3: `Medium` (needs monitoring)
- Rating 4-5: `Low` (satisfied customers)

**Additional Fields:**
- `costs`: Mock cost data (random $10-60 range)
- `region`: Random assignment from US-East, US-West, EU-Central, Asia-Pacific
- `owner`: Maps to `customerName` from review
- `lastEdited`: Maps to `updatedAt` from review

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (validation errors)
- `404`: Resource not found
- `500`: Internal server error

## Testing

Run the test suite to verify all endpoints:

```bash
node backend/src/tests/dashboardApiTests.js
```

This tests both the calculation functions and live API endpoints.