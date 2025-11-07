import express from "express";
import cors from "cors";
import reviewsRouter from "./routes/reviews.js";
import exportRouter from "./routes/export.js";

const app = express();
const port = 2509;

// Middleware
app.use(
  cors({
    origin: "*",
  }),
);

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/reviews", reviewsRouter);
app.use("/api/export", exportRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send(`
    <h1>Customer Satisfaction System API</h1>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><strong>GET /api/reviews</strong> - Get all reviews</li>
      <li><strong>GET /api/reviews/:id</strong> - Get review by ID</li>
      <li><strong>POST /api/reviews</strong> - Create new review</li>
      <li><strong>PUT /api/reviews/:id</strong> - Update review</li>
      <li><strong>DELETE /api/reviews/:id</strong> - Delete review</li>
      <li><strong>GET /api/export/csv</strong> - Export reviews as CSV</li>
      <li><strong>GET /api/export/json</strong> - Export reviews as JSON</li>
      <li><strong>GET /api/export/summary</strong> - Get summary statistics</li>
    </ul>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('API Documentation available at http://localhost:' + port);
});
