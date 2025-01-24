import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./Mydata.css";

const Mydata = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("jwt"); // Retrieve token from localStorage

    if (!token) {
      setError("User not logged in. Please log in to view your data.");
      setLoading(false);
      return;
    }

    try {
      // Fetch files from the backend
      const response = await axios.get("http://localhost:5000/api/users/files", {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
      setFiles(response.data.files || []); // Assuming `files` is an array of uploaded files
      setLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to fetch files. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (public_id) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setError("User not logged in. Please log in to delete files.");
      return;
    }

    try {
      // Send DELETE request to backend with token and file details
      const response = await axios.delete("http://localhost:5000/api/users/delete", {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        data: { public_id }, // Pass the public_id in the request body
      });

      if (response.status === 200) {
        // Remove the deleted file from the list
        setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== public_id));
        toast.success("File deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete the file. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Uploaded Files</h2>
      <ToastContainer />
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : files && files.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>File Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Upload {index + 1}</td>
                  <td>
                    <a
                      href={file.url} // Redirect to Cloudinary file URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary me-2"
                    >
                      View
                    </a>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(file.public_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No files available. Upload some files to display them here!</p>
      )}
    </div>
  );
};

export default Mydata;
