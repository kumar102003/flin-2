import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userImage from "../assest/user.png";
import { UserContext } from "../components/contextAPI/userContext"; // Import UserContext
import "./Profile.css";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext); // Destructure user and logout from context

  const fetchUserData = async () => {
    if (!user || !user.token) {
      console.log("No token found in context. User might not be logged in.");
      logout(); // Log out the user if no token is found
      navigate("/login"); // Redirect to login
      return;
    }

    try {
      // Send token in Authorization header
      const response = await axios.get("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Resolve the photoURL dynamically
      const resolvedPhotoURL = response.data.user.photoURL || userImage;

      // Set user details in state
      setUserDetails({
        ...response.data.user,
        photoURL: resolvedPhotoURL,
      });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      if (error.response?.status === 401) {
        // Token might be invalid or expired
        logout(); // Log out the user
        navigate("/login"); // Redirect to login
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
          <button className="btn btn-danger mt-3 me-3" onClick={logout}>
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
