import express from "express";
import videosRouter from "./routes/videos.js";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/videos", express.static(path.join(__dirname, "public", "videos")));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.use("/videos", videosRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
