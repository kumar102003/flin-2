import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from "./firebase"; 
import { OAuthProvider, signInWithPopup } from 'firebase/auth';

const Apple = () => {
  const navigate = useNavigate(); 

  const appleLogin = async () => {
    try {
      
      const provider = new OAuthProvider('apple.com');

      
      provider.addScope('email');
      provider.addScope('name');

      // Sign in with a popup
      await signInWithPopup(auth, provider);
      console.log("Apple login successful!");

      // Navigate to the home page upon successful login
      navigate("/home");
    } catch (error) {
      console.error("Error during Apple login:", error.message);
    }
  };

  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={appleLogin}
      >
        <img src={require("../apple.png")} width={"60%"} style={{  border: "2px solid #000" }}  alt="Google Login" />
      </div>
    </div>
  );
};

export default Apple;
