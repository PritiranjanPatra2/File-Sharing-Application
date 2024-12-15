import React, { useState, useEffect } from "react";
import axios from "axios";
import "./File.css";

const File = () => {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("https://file-sharing-application-7v1t.onrender.com/files");
        setAllFiles(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to fetch uploaded files.");
      }
    };
    fetchFiles();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!file) {
      setError("Please select a file to upload");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://file-sharing-application-7v1t.onrender.com/submit-form",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      
      setUploadedFile(response.data.fileUrl);
      setAllFiles((prevFiles) => [...prevFiles, response.data]);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (fileUrl) => {
    navigator.clipboard.writeText(fileUrl);
    alert("File link copied to clipboard!");
  };

  return (
    <div className="container">
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Choose a file:</label>
        <input type="file" id="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      {uploadedFile && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded File:</h3>
          <div>
            <button
              onClick={() => window.open(uploadedFile, "_blank")}
              style={{ marginRight: "10px" }}
            >
              View File
            </button>
            <button onClick={() => handleShare(uploadedFile)}>Share Link</button>
          </div>
        </div>
      )}

      <div className="file-list">
        <h2>All Uploaded Files</h2>
        <ul>
          {allFiles.map((file) => (
            file.fileUrl ? ( // Defensive check for fileUrl
              <li key={file._id} className="file-item">
                <span>{file.fileUrl.split("/").pop()}</span>
                <div>
                  <button
                    onClick={() => window.open(file.fileUrl, "_blank")}
                    style={{ marginRight: "10px" }}
                  >
                    View
                  </button>
                  <button onClick={() => handleShare(file.fileUrl)}>
                    Share Link
                  </button>
                </div>
              </li>
            ) : (
              <li key={file._id} className="file-item">
                <span style={{ color: "red" }}>Invalid file data</span>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

export default File;
