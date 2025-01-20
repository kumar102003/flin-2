import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, ProgressBar, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0); // Track uploaded files count
  const navigate = useNavigate();

  // Fetch uploaded files count on component mount
  useEffect(() => {
    const fetchUploadedFilesCount = async () => {
      const uid = localStorage.getItem("uid");
      console.log("Fetching uploaded files for UID:", uid);

      if (!uid) {
        //.error("Please log in to continue.", { position: "top-center" });
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${uid}`);

        // Access the `files` array directly from the response
        if (response.data && response.data.files) {
          setUploadedFilesCount(response.data.files.length);
        } else {
          console.error("Files data is missing in the response.");
          toast.error("Failed to fetch user data.", { position: "top-center" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.", { position: "top-center" });
      }
    };

    fetchUploadedFilesCount();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent page refresh on button click
  
    const uid = localStorage.getItem("uid");
    if (!uid) {
      toast.error("Please log in to upload files.", { position: "top-center" });
      return;
    }
  
    if (!file) {
      toast.error("Please select a file to upload.", { position: "top-center" });
      return;
    }
    // Check if the user has reached the upload limit
    if (uploadedFilesCount >= 10) {
      setShowModal(true);
      return;
    }
  
    
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uid", uid);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          },
        }
      );
  
      toast.success("File uploaded successfully!", { position: "top-center" });
      setUploadProgress(0);
      setFile(null);
  
      // Increment uploaded files count
      setUploadedFilesCount((prevCount) => prevCount + 1);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setShowModal(true);
      } else if (error.code === "ECONNABORTED") {
        toast.error("Upload request timed out. Please try again.", {
          position: "top-center",
        });
      } else {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file. Please try again.", {
          position: "top-center",
        });
      }
    }
  };
  

  const handleUpgrade = () => {
    setShowModal(false);
    navigate("/upgrade");
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate("/home");
  };

  return (
    <Container>
      <h2 className="mt-4">File Upload</h2>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select a file to upload</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>

      <Button onClick={handleUpload} variant="primary">
        Upload
      </Button>

      {uploadProgress > 0 && (
        <ProgressBar
          now={uploadProgress}
          label={`${uploadProgress}%`}
          className="mt-3"
        />
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upgrade Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You have reached the free uploads limit. Upgrade your plan to upload more files.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpgrade}>
            Upgrade Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FileUpload;
