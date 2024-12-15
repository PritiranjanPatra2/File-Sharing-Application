import { v2 as cloudinary } from "cloudinary";

const cloud = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" }, // Accept any file type
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          console.log("Cloudinary Upload Success:", result);
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export default cloud;
