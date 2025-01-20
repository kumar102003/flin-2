import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";

const Google = () => {
  const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google login successful!");

      // Send user data to the backend
      const payload = {
        google: true,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || null, // Include photoURL
      };

      const response = await axios.post("http://localhost:5000/api/users/register", payload);
      console.log("Backend registration response:", response.data);

      // Store user data in localStorage
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);
      localStorage.setItem("displayName", user.displayName);
      localStorage.setItem("photoURL", user.photoURL); // Save the photoURL

      // Navigate to the home page
      navigate("/home");
    } catch (error) {
      console.error("Error during Google login:", error.message);
    }
  };

  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={require("../google.png")} width={"60%"} alt="Google Login" />
      </div>
    </div>
  );
};

export default Google;
