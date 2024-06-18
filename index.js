import express from "express";
import videosRouter from "./routes/videos.js";
import cors from "cors";
import "dotenv/config";
import fs from "fs";

const app = express();

app.use(cors());

app.use(express.json());

// app.use("/images", express.static("./public/images"));

const PORT = process.env.PORT || 8080;

// Home route
app.get("/", (req, res) => {
  res.send("Homepage");
});

app.use("/videos", videosRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
