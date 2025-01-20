import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Google from "./Google";
import Apple from "./Apple";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the backend login API
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { uid } = response.data.user; // Extract uid from the response

        // Store uid in localStorage
        localStorage.setItem("uid", uid);

        // Show success toast and redirect to home page
        toast.success("User logged in successfully", {
          position: "top-center",
        });

        // Redirect to home page
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);

      // Show error toast
      toast.error(error.response?.data?.message || "Login failed", {
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
