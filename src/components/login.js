import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Google from "./Google";
import Apple from "./Apple";
import { useNavigate } from "react-router-dom"; // Import React Router's useNavigate
import { UserContext } from "../components/contextAPI/userContext"; // Import UserContext

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate
  const { login } = useContext(UserContext); // Get the login method from UserContext

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Use Firebase Client SDK to log in the user
  //     const auth = getAuth();
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //     // Get the ID token from Firebase
  //     const idToken = await user.getIdToken();
  //     console.log("Here is the ID token:", idToken);

  //     // Send the ID token to the backend
  //     const response = await axios.post("http://localhost:5000/api/users/login", {
  //       idToken, // Send the token instead of email/password
  //     });

  //     if (response.status === 200) {
  //       // Store the token globally via UserContext
  //       login(idToken);

  //       // Show success toast and redirect to home page
  //       toast.success("User logged in successfully", {
  //         position: "top-center",
  //       });

  //       // Use React Router's navigate to redirect without refresh
  //       navigate("/home");
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error.response?.data?.message || error.message);

  //     // Show error toast
  //     toast.error(error.response?.data?.message || "Login failed", {
  //       position: "bottom-center",
  //     });
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Use Firebase Client SDK to log in the user
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Get the ID token from Firebase
      const idToken = await user.getIdToken();
      console.log("Here is the Firebase ID token:", idToken);
  
      // Send the ID token to the backend
      const response = await axios.post("http://localhost:5000/api/users/login", {
        idToken, // Send the Firebase ID token for verification
      });
  
      if (response.status === 200) {
        const { token, user: backendUser } = response.data; // Extract backend JWT and user details
  
        // Save the backend JWT in localStorage (or cookies for more security)
        console.log("Here us token of login user " , token);
        localStorage.setItem("jwt", token);
  
        // Update global user state via UserContext
        login(
          token,
          );
  
        // Show success toast
        toast.success("User logged in successfully", {
          position: "top-center",
        });
  
        // Redirect to home page or a protected route
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
  
      // Show error toast
      toast.error(error.response?.data?.message || "Login failed. Please try again.", {
        position: "bottom-center",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
      <p className="forgot-password text-right">
        New user <a href="/register">Register Here</a>
      </p>
      <Google />
      <Apple />
    </form>
  );
}

export default Login;
