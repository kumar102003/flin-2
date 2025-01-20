import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userImage from "../assest/user.png"; // Default user image
import './Profile.css'
function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const storedUid = localStorage.getItem("uid"); // Retrieve UID from localStorage
    const localPhotoURL = localStorage.getItem("photoURL"); // Retrieve photoURL from localStorage

    if (!storedUid) {
      console.log("No UID found in localStorage. User might not be logged in.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/profile/${storedUid}`
      );

      // Use API's photoURL if available, fallback to localStorage, or use the default image
      const resolvedPhotoURL =
        response.data.photoURL || localPhotoURL || userImage;

      // Combine user details with the resolved photoURL
      setUserDetails({
        ...response.data,
        photoURL: resolvedPhotoURL,
      });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("uid");
      localStorage.removeItem("photoURL"); // Clear the photoURL from localStorage
      navigate("/login"); // Redirect to login
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleViewUploads = () => {
    navigate("/mydata");
  };

  return (
    <div className="container profile-container">
      {userDetails ? (
        <div className="profile-card">
          <img
            src={userDetails.photoURL} // Dynamically resolved photoURL
            alt={userDetails.firstName || "User"}
            className="profile-img"
          />
          <h3>Welcome, {userDetails.firstName}!</h3>
          <div className="profile-info">
            <h5>User Information</h5>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>First Name:</strong> {userDetails.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {userDetails.lastName}
            </p>
          </div>
          <button className="btn btn-danger mt-3 me-3" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn btn-primary mt-3" onClick={handleViewUploads}>
            View Your Uploads
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
