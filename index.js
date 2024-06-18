import express from "express";
import videoRoutes from "./routes/videos.js";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8080;

// Home route
app.get("/", (req, res) => {
  res.send("Homepage");
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
