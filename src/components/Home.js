import React from "react";
import Navbar from "./Navbar";
import { auth } from "./firebase";
import WeProvide from "./HomeContent/WeProvide";
import Upload from "./Upload";

const Home = () => {
  // async function handleLogout() {
  //   try {
  //     await auth.signOut();
  //     window.location.href = "/login";
  //     console.log("User logged out successfully!");
  //   } catch (error) {
  //     console.error("Error logging out:", error.message);
  //   }
  // }

  return (
    <div>
        
      <Upload/>
      <WeProvide/>
    </div>
  );
};

export default Home;
