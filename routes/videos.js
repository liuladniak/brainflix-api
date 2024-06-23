import express from "express";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import multer from "multer";
const router = express.Router();
import slugify from "slugify";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/videos");
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const slug = slugify(originalName, { lower: true });
    cb(null, `${timestamp}-${slug}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["video/mp4", "video/mkv", "video/webm"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      "Invalid file type. Only MP4, MKV, and WEBM video files are allowed."
    );
    error.code = "INVALID_FILE_TYPE";
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const videoFilePath = "./data/videos.json";

const readVideoFile = () => {
  const videoFile = fs.readFileSync(videoFilePath);
  const videoData = JSON.parse(videoFile);
  return videoData;
};

const writeVideoFile = (data) => {
  const strigifiedData = JSON.stringify(data);
  fs.writeFileSync(videoFilePath, strigifiedData);
};

router.get("/", (req, res) => {
  const videoData = readVideoFile();

  const strippedData = videoData.map((video) => {
    return {
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    };
  });
  res.json(strippedData);
});

router.get("/:id", (req, res) => {
  const videoData = readVideoFile();

  const singleVideo = videoData.find((video) => video.id === req.params.id);
  if (singleVideo) {
    res.json(singleVideo);
  } else {
    res.status(404).json({
      message: "Video not found",
      error: "404",
    });
  }
});

router.post("/", upload.single("video"), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a video file." });
  }
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({
      message: "Title and description are required.",
    });
  }

  const newVideo = {
    id: crypto.randomUUID(),
    title: req.body.title,
    channel: req.body.channel,
    description: req.body.description,
    image: req.body.image,
    video: `/videos/${req.file.filename}`,
    views: "0",
    likes: "0",
    duration: "0:00",
    timestamp: Date.now(),
    comments: [],
  };

  const videoData = readVideoFile();

  videoData.push(newVideo);
  writeVideoFile(videoData);

  res.status(201).json(newVideo);
});

export default router;
