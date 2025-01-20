import React from 'react'
import "../../assest/upload.png"
import "./WeProvide.css"
import subscribeImage from "../../assest/subscribe.png"
const WeProvide = () => {
  return (
    <div>
       
       <div className="we-provide-container">
      <h1 className="header">What We Provide</h1>
      <p className="description">
        Explore the range of features and services that make managing your data seamless.
      </p>

      <div className="service-item">
        <img
        
          src="https://cdn.pixabay.com/photo/2017/02/07/02/16/cloud-2044823_640.png"
          alt="Upload Data"
          style={{ width: '115px', height: 'auto'}}
          className="service-image mx-3"
        />
        <div className="service-details">
          <h3>Upload Data</h3>
          <p>Upload photos, videos, and files effortlessly and manage them securely.</p>
        </div>
      </div>

      <div className="service-item">
        <img
          src="https://png.pngtree.com/png-vector/20220625/ourmid/pngtree-cloud-secure-storage-icon-png-image_5344106.png"
          alt="Secure Storage"
          style={{ width: '150px', height: 'auto' }}
          className="service-image"
        />
        <div className="service-details">
          <h3>Secure Storage</h3>
          <p>Keep your data safe and easily accessible anytime, anywhere.</p>
        </div>
      </div>

      <div className="service-item">
        <img
          src={subscribeImage} 
          style={{ width: '150px', height: 'auto' }}
          alt="Subscription Plans"
          className="service-image"
        />
        <div className="service-details">
          <h3>Subscription Plans</h3>
          <p>
            Enjoy free uploads or unlock premium features with our subscription
            plans.
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default WeProvide
