import express from "express";
import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import cloud from "./cloud.js";
import mongoose from "mongoose";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
const API = process.env.CLOUDNAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const URL = process.env.URL;
cloudinary.config({
  cloud_name: API,
  api_key: API_KEY,
  api_secret: API_SECRET,
});
const fileSchema = new mongoose.Schema({
  fileUrl: String,
});
const fileModel = mongoose.model("File", fileSchema);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post("/submit-form", upload.single("file"), async (req, res) => {
    console.log("Request hit: /submit-form");
  
    try {
      // Check if the file exists
      if (!req.file) {
        return res.status(400).send({ message: "No file uploaded" });
      }
  
      console.log("File received from client:", req.file);
  
      // Upload to Cloudinary
      const img = await cloud(req.file.buffer);
    //   console.log("Cloudinary response:", img);
  
      // Extract the secure URL
      const imageUrl = img.secure_url;
    //   console.log("Secure URL:", imageUrl);
  
      // Save to database
      const file = new fileModel({ fileUrl: imageUrl });
      await file.save();
  
      res.status(200).send(file);
    } catch (err) {
      console.error("Error during file upload:", err);
      res.status(500).send({ message: "Error uploading file", error: err.message });
    }
  });
  
app.get("/files", async (req, res) => {
  try {
    const files = await fileModel.find();
    res.json(files);
  } catch (err) {
    res.status(500).send({ message: "Error fetching files", error: err });
  }
});


mongoose
  .connect(URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
