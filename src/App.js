import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom"; // Removed BrowserRouter alias
import Home from "./components/Home";
import Login from "./components/login";
import SignUp from "./components/register";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./components/firebase";
import Mydata from "./components/Mydata";
import AboutUs from "./components/AboutUs";
import Navbar from "./components/Navbar";
import Upload from "./components/Upload";
import Upgrade from "./components/Upgrade";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          {/* Login and Register Routes */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/home" />
              ) : (
                <div className="auth-wrapper">
                  <div className="auth-inner">
                    <Login />
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/login"
            element={
              <div className="auth-wrapper">
                <div className="auth-inner">
                  <Login />
                </div>
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="auth-wrapper">
                <div className="auth-inner">
                  <SignUp />
                </div>
              </div>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/mydata" element={<Mydata />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/upgrade" element={<Upgrade />} />
        </Routes>
        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
