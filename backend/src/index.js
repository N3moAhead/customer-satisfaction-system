import express from "express";
const app = express();
const port = 2509;

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Customer-Satisfaction-Backend</h1>");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
