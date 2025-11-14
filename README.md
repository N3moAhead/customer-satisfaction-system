# Customer Satisfaction System

A complete customer satisfaction system with a React frontend and Express.js REST API backend for managing customer reviews and feedback.

## Features

### REST API (Backend)
- **CRUD Operations**: Create, read, update, and delete customer reviews
- **Data Export**: Export reviews in CSV and JSON formats
- **Filtering & Pagination**: Filter reviews by status, rating, customer ID with pagination support
- **Summary Statistics**: Get aggregate statistics about reviews
- **Data Validation**: Comprehensive input validation with detailed error messages
- **File-based Storage**: JSON file storage (easily replaceable with database)

### API Endpoints

#### Reviews
- `GET /api/reviews` - Get all reviews with optional filters
- `GET /api/reviews/:id` - Get specific review by ID
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update existing review
- `DELETE /api/reviews/:id` - Delete review

#### Data Export
- `GET /api/export/csv` - Export reviews as CSV
- `GET /api/export/json` - Export reviews as JSON
- `GET /api/export/summary` - Get summary statistics

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation & Setup

1. **Clone and navigate to the project:**
   ```bash
   cd customer-satisfaction-system
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend API:**
   ```bash
   cd backend
   npm start
   ```
   The API will be available at `http://localhost:2509`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### Testing

**Run API tests:**
```bash
cd backend
npm test
```

**Run the demo:**
```bash
./demo.sh
```

## Project Structure

```
customer-satisfaction-system/
├── backend/
│   ├── src/
│   │   ├── models/          # Data models and validation
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic and data access
│   │   ├── data/            # JSON data storage
│   │   ├── tests/           # API tests
│   │   └── index.js         # Main server file
│   ├── package.json
│   └── API_DOCUMENTATION.md # Detailed API docs
├── frontend/                # Next.js React frontend
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   └── data/           # Frontend data and schemas
│   └── package.json
├── demo.sh                 # Interactive demo script
└── README.md
```

## API Usage Examples

### Create a Review
```bash
curl -X POST http://localhost:2509/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_123",
    "customerName": "John Doe",
    "rating": 5,
    "title": "Excellent service!",
    "comment": "Very satisfied with the product quality."
  }'
```

### Get Reviews with Filters
```bash
# Get approved reviews with rating 5
curl "http://localhost:2509/api/reviews?status=approved&rating=5"

# Get reviews with pagination
curl "http://localhost:2509/api/reviews?limit=10&offset=20"
```

### Export Data
```bash
# Export as CSV
curl "http://localhost:2509/api/export/csv" -o reviews.csv

# Get summary statistics
curl "http://localhost:2509/api/export/summary"
```

## Review Schema

Reviews have the following structure:

```javascript
{
  id: "uuid",                    // Auto-generated unique ID
  customerId: "string",          // Customer identifier
  customerName: "string",        // Customer's name
  rating: 1-5,                   // Numeric rating
  title: "string",               // Review title
  comment: "string",             // Review text
  status: "pending|approved|rejected", // Review status
  createdAt: "ISO date string",  // Creation timestamp
  updatedAt: "ISO date string"   // Last update timestamp
}
```

## Key Design Decisions

1. **Simple Storage**: Uses JSON files for data persistence, making it easy to understand and replace with a database
2. **Comprehensive Validation**: All inputs are validated with detailed error messages
3. **RESTful Design**: Follows REST conventions for predictable API behavior
4. **Error Handling**: Consistent error response format across all endpoints
5. **Export Functionality**: Multiple export formats for data analysis
6. **Testing**: Comprehensive test suite covering all functionality

## Next Steps / Enhancements

- Replace JSON file storage with a proper database (PostgreSQL, MongoDB)
- Add authentication and authorization
- Implement rate limiting
- Add email notifications for new reviews
- Create admin dashboard in the frontend
- Add real-time updates with WebSockets
- Implement caching for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License