import "./Home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import WeProvide from "./HomeContent/WeProvide";
import Upload from "./Upload";
import SidePage from "./SidePage";
import { toast } from "react-toastify";

const Home = () => {
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

  // Fetch file count from the server
  const fetchUploadedFilesCount = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      toast.error("Please log in to continue.", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/users/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.files) {
        setUploadedFilesCount(response.data.files.length);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.", { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchUploadedFilesCount(); // Fetch count on component mount
  }, []);

  // Callback for successful uploads
  const handleUploadSuccess = () => {
    fetchUploadedFilesCount(); // Fetch latest file count after upload
  };

  return (
    <div className="main-container ">
      <div className="side-column">
        <SidePage uploadedFilesCount={uploadedFilesCount} />
      </div>
      <div className="content-column">
        <div className="content-row">
          <div className="content-box">
            <Upload onUploadSuccess={handleUploadSuccess} />
          </div>
          <div className="content-box">
            <WeProvide />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
