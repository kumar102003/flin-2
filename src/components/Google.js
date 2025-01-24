import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import { UserContext } from "./contextAPI/userContext"; // Import UserContext
import { toast } from "react-toastify"; // Import Toast for better UX
const Google = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext); // Access the login function from UserContext

  // const googleLogin = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  
  //     console.log("Google login successful!");
  
  //     // Retrieve ID token
  //     const idToken = await user.getIdToken();
  //     console.log("Google token: ", idToken);
  
  //     // Get the user's display name or set it to a default value
  //     const displayName = user.displayName || "";
  //     const [firstName, lastName] = displayName.split(" ");
  
  //     // Send ID token along with user details to the backend
  //     const payload = {
  //       google: true,
  //       idToken,
  //       firstName,  // Add firstName here
  //       lastName,   // Add lastName here
  //     };
  
  //     const response = await axios.post(
  //       "http://localhost:5000/api/users/register",
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${idToken}`, // Add the Authorization header
  //         },
  //       }
  //     );
  
  //     console.log("Backend registration response:", response.data);
  
  //     if (response.status === 201 || response.status === 200) {
  //       // Save token and photoURL in localStorage
  //       const photoURL = user.photoURL; // Retrieve Google photo URL
  //       localStorage.setItem("token", idToken);
  //       localStorage.setItem("photoURL", photoURL);
  
  //       // Update UserContext with the token
  //       login(idToken);
  
  //       // Redirect to the home page
  //       navigate("/home");
  //     }
  //   } catch (error) {
  //     console.error("Error during Google login:", error.message);
  //   }
  // };
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("Google login successful!");
  
      // Retrieve Firebase ID token
      const idToken = await user.getIdToken();
      console.log("Google token: ", idToken);
  
      // Extract user details
      const displayName = user.displayName || "";
      const [firstName, lastName] = displayName.split(" ");
      const photoURL = user.photoURL; // Google profile picture URL
  
      // Send ID token to backend for verification and JWT generation
      const payload = {
        google: true,
        idToken,
        firstName,
        lastName,
      };
  
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        payload
      );
  
      console.log("Backend registration response:", response.data);
  
      if (response.status === 201 || response.status === 200) {
        // Extract backend JWT and user details
        const { token, user: backendUser } = response.data;
  
        // Save backend JWT in localStorage (or cookies for more security)
        localStorage.setItem("jwt", token);
        localStorage.setItem("photoURL", photoURL);
  
        // Update UserContext with the user details and token
        login(
          token,
        );
  
        // Redirect to the home page or dashboard
        navigate("/");
      }
    } catch (error) {
      console.error("Error during Google login:", error.message);
  
      // Optionally show a toast message for the error
      toast.error("Google login failed. Please try again.", {
        position: "top-center",
      });
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
