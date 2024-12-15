import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
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
  try {
    const uploadedFile = await cloudinary.uploader.upload_stream({
      resource_type: "auto",
    }).end(req.file.buffer);

    const imageUrl = uploadedFile.secure_url;
    const file = new fileModel({ fileUrl: imageUrl });
    await file.save();

    res.send(file);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send({ message: "File upload failed", error: err });
  }
});

app.get("/files", async (req, res) => {
  try {
    const files = await fileModel.find();
    res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).send({ message: "Failed to fetch files", error: err });
  }
});

mongoose
  .connect(URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
