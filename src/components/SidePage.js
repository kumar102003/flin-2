import './css/SidePage.css';
import React, { useState, useEffect } from "react";

const SidePage = ({ uploadedFilesCount }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (uploadedFilesCount > 0) {
      setProgress((uploadedFilesCount / 10) * 100); // Progress based on uploaded files
      setIsPopupVisible(true); // Show popup
      setTimeout(() => setIsPopupVisible(false), 3000); // Auto-hide popup after 3 seconds
    } else {
      setProgress(0);
      setIsPopupVisible(false);
    }
  }, [uploadedFilesCount]);

  const getColor = (value) => {
    if (value <= 50) {
      const red = 255;
      const green = Math.round((value / 50) * 255);
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const red = Math.round(255 - ((value - 50) / 50) * 255);
      const green = 255;
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  return (
    <div>
      {uploadedFilesCount === 0 ? (
        <div className="placeholder-container">
          <p>No files uploaded. Upload files to see your progress.</p>
        </div>
      ) : (
        <div className={`popup-container ${isPopupVisible ? "visible" : ""}`}>
          <h4 className="matchRateTitle">Match Rate</h4>
          <div className="outer-circle">
            <div
              className="progress-ring"
              style={{
                background: `conic-gradient(
                  ${getColor(progress)} ${progress * 3.6}deg,
                  transparent ${progress * 3.6}deg
                )`,
              }}
            ></div>
            <div className="inner-circle">
              <div className="progress-text">{progress}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePage;
