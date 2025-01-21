
import './Home.css'
import React from "react";
import WeProvide from "./HomeContent/WeProvide";
import Upload from "./Upload";
import SidePage from "./SidePage"; // Assuming you want a separate side page on the left

const Home = () => {
  return (
    <div>
      <div className="main-container">
        <div className="side-column">
          <SidePage />  {/* Left column with SidePage */}
        </div>

        <div className="content-column">
          <div className="content-row">
            <div className="content-box">
              <Upload />  {/* Upload component */}
            </div>
            <div className="content-box">
              <WeProvide />  {/* WeProvide component */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
