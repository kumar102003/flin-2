
import  './css/SidePage.css'

import React, { useState } from "react";
//import "./Sidepage.css";

const Sidepage = () => {
  const [progress, setProgress] = useState(0);

 
  const getColor = (value) => {
    if (value <= 50) {
      // Transition from red to yellow (0 to 50%)
      const red = 255;
      const green = Math.round((value / 50) * 255);
      return `rgb(${red}, ${green}, 0)`;
    } else {
      // Transition from yellow to green (51 to 100%)
      const red = Math.round(255 - ((value - 50) / 50) * 255);
      const green = 255;
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  const incrementProgress = () => {
    setProgress((prev) => (prev < 100 ? prev + 5 : 100)); 
  };

  return (
    <div className="progress-container">
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
      <button className="update-button" onClick={incrementProgress}>
        Increment Progress
      </button>
    </div>
  );
};

export default Sidepage;
