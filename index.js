import express from "express";
import cors from "cors";
import crypto from "crypto";
import "dotenv/config";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to application");
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
