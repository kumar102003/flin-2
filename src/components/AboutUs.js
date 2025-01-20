import React from 'react';
import Navbar from './Navbar';
import './AboutUs.css'
const AboutUs = () => {
  return (
    <div>
        
        <div className="container my-5">
      <h1 className="text-center mb-4">About Us</h1>
      <p className="lead text-center">
        Welcome to our platform! We aim to provide a seamless and user-friendly experience for uploading, managing, and accessing your data online. Our mission is to make data accessibility efficient and secure.
      </p>
      <div className="row my-4">
        <div className="col-md-6">
          <h3>Our Vision</h3>
          <p>
            To become a trusted platform where users can easily manage their data with confidence and security, ensuring privacy and accessibility.
          </p>
        </div>
        <div className="col-md-6">
          <h3>Our Mission</h3>
          <p>
            We are dedicated to empowering individuals and businesses by providing robust tools to handle their data needs efficiently, backed by modern technology.
          </p>
        </div>
      </div>
      <div className="text-center mt-4">
        <h3>Contact Us</h3>
        <p>
          Have questions? Reach out to us at <a href="mailto:support@yourplatform.com">support@yourplatform.com</a>.
        </p>
      </div>
    </div>
    </div>
  );
};

export default AboutUs;
