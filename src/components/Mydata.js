import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import './Mydata.css'
const Mydata = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const uid = localStorage.getItem("uid"); // Fetch UID from localStorage

    if (!uid) {
      setError("User not logged in. Please log in to view your data.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/profile/${uid}`
      ); // Pass UID as a parameter
      setFiles(response.data.files || []); // Assuming `files` is the array of uploaded files
      setLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to fetch files. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (public_id) => {
    const uid = localStorage.getItem("uid");
  
    if (!uid) {
      setError("User not logged in. Please log in to delete files.");
      return;
    }
  
    try {
      // Use query parameters to send uid and public_id
      const response = await axios.delete(
        `http://localhost:5000/api/users/delete`,
        {
          data: {
            uid,
            public_id,
          },
        }
      );
  
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
      alert("Failed to delete the file. Please try again.");
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Uploaded Files</h2>
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
