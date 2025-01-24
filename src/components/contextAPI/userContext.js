// import React, { createContext, useState, useEffect } from "react";

// // Create the UserContext
// export const UserContext = createContext();

// // UserContext Provider
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load user from localStorage when the app initializes
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setUser({ token: storedToken }); // Restore the user state
//     }
//   }, []);

//   // Function to log in and save user details
//   const login = (token) => {
//     localStorage.setItem("jwt", token); // Save token to localStorage
//     setUser({ token }); // Update user state
//   };

//   // Function to log out and clear user details
//   const logout = () => {
//     localStorage.clear();

//     // Clear the user state in context
//     setUser(null);
  
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect } from "react";

// Create the UserContext
export const UserContext = createContext();

// UserContext Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app initializes
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt"); // Use jwt instead of token to align
    if (storedToken) {
      // You can add logic to validate if the token is still valid here (check expiration time)
      setUser({ token: storedToken }); // Restore the user state
    }
  }, []);

  // Function to log in and save user details
  const login = (token) => {
    localStorage.setItem("jwt", token); // Save token to localStorage
    setUser({ token }); // Update user state
  };

  // Function to log out and clear user details
  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("photoURL") // Remove token from localStorage
    setUser(null); // Clear the user state
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
