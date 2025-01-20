import React, { createContext, useState, useEffect } from "react";

// Create the UserContext
export const UserContext = createContext();

// UserContext Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app initializes
  useEffect(() => {
    const storedUser = localStorage.getItem("uid");
    if (storedUser) {
      setUser({ uid: storedUser }); // Restore the user state
    }
  }, []);

  // Function to log in and save user details
  const login = (uid) => {
    localStorage.setItem("uid", uid); // Save uid to localStorage
    setUser({ uid }); // Update user state
  };

  // Function to log out and clear user details
  const logout = () => {
    localStorage.clear() // Remove uid from localStorage
    setUser(null); // Clear user state
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
