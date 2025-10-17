import express from "express";
import cors from "cors";
const app = express();
const port = 2509;

app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Customer-Satisfaction-Backend</h1>");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
