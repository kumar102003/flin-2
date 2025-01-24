import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, ProgressBar, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpload = ({ onUploadSuccess }) => {  // Pass callback prop here
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref for the file input element

  useEffect(() => {
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
        } else {
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
    e.preventDefault();

    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Please log in to upload files.", { position: "top-center" });
      return;
    }

    if (!file) {
      console.log("No file selected!");
      toast.error("Please select a file to upload.", { position: "top-center" });
      return;
    }

    if (uploadedFilesCount >= 10) {
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/users/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        },
      });

      toast.success("File uploaded successfully!", { position: "top-center" });
      setUploadProgress(0);
      setFile(null); // Reset file state

      // Clear file input field using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // After upload, notify Home component to update the sidebar
      onUploadSuccess(uploadedFilesCount + 1);  // Pass the new file count to Home

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
      <ToastContainer />
      <h2 className="mt-4">File Upload</h2>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="fileInput">Select a file to upload</Form.Label>
        <Form.Control
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef} // Attach ref to file input
        />
      </Form.Group>

      <Button onClick={handleUpload} variant="primary">
        Upload
      </Button>

      {uploadProgress > 0 && (
        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />
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
