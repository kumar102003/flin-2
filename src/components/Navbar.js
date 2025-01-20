import React, { useState, useEffect } from "react";
import { useNavigate , Link} from "react-router-dom";
import userImage from "../assest/user.png"; // Default user image

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user state from localStorage on component mount and when localStorage changes
  const uid = localStorage.getItem("uid");
  useEffect(() => {
   
    const handleStorageChange = () => {
      const uid = localStorage.getItem("uid");
      const email = localStorage.getItem("email");
      const displayName = localStorage.getItem("displayName");
      const photoURL = localStorage.getItem("photoURL");
      if (uid) {
        setUser({ uid, email, displayName, photoURL });
      } else {
        setUser(null);
      }
    };
    

    handleStorageChange(); // Initial load
    window.addEventListener("storage", handleStorageChange); // Listen for storage changes

    return () => {
      window.removeEventListener("storage", handleStorageChange); // Clean up listener
    };
    
  }, [uid]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    alert("You have logged out successfully!");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleUpgrade = () => {
    navigate("/upgrade");
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      style={{
        position: "sticky",
        top: "0",
        width: "100%",
        zIndex: "9999",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand text-primary fs-1 fw-bold text-uppercase letter-spacing mx-3"
          to="/home"
        >
          FLIN
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item mx-5">
              <Link
                className="nav-link active text-primary"
                aria-current="page"
                to="/mydata"
              >
                My Data
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-primary" to="/aboutus">
                About Us
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            {user ? (
              <>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={handleUpgrade}
                >
                  Upgrade
                </button>
                <img
                  src={user.photoURL || userImage} // Use the photoURL if available, else default
                  alt="User"
                  className="rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                  onClick={handleProfile}
                />
                <button
                  className="btn btn-outline-danger me-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-outline-secondary" to="/register">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
