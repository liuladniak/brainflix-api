import express from "express";
import fs from "fs";
import crypto from "crypto";

const router = express.Router();

const readVideoFile = () => {
  const videoFile = fs.readFileSync("./data/videos.json");
  const videoData = JSON.parse(videoFile);

  return videoData;
};

const writeVideoFile = (data) => {
  const strigifiedData = JSON.stringify(data);
  fs.writeFileSync("./data/videos.json", strigifiedData);
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

router.post("/", (req, res) => {
  const newVideo = {
    id: crypto.randomUUID(),
    title: req.body.title,
    channel: req.body.channel,
    image: req.body.image,
  };

  const videoData = readVideoFile();

  videoData.push(newVideo);
  writeVideoFile(videoData);

  res.status(201).json(newVideo);
});
export default router;
