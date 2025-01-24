const admin = require("../utils/firebaseConfig.js") ;
const ApiError = require("../utils/ApiError.js") ;
const jwt = require("jsonwebtoken");
// const verifyToken = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1]; 
//     console.log(token)
//     if (!token) {
//       throw new ApiError(401, "Unauthorized access - Missing token");
//     }
//   console.log("hello ")
//     const decodedToken = await admin.auth().verifyIdToken(token); 
//     // console.log(decodedToken,"13")
//     console.log(decodedToken)
//     req.user = decodedToken;
//     next(); 
//   } catch (error) {
//     next(new ApiError(401, "Unauthorized access - Invalid token"));
//   }
// };






const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Extract token from the Authorization header
    console.log("Received Token:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized access - Missing token");
    }

    let decodedToken;

    // Attempt to verify the token as a custom JWT first
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
      console.log("Verified Custom JWT:", decodedToken);
    } catch (jwtError) {
      console.log("Custom JWT verification failed. Attempting Firebase verification...");
      
      // If custom JWT verification fails, attempt to verify as a Firebase ID token
      try {
        decodedToken = await admin.auth().verifyIdToken(token);
        console.log("Verified Firebase ID Token:", decodedToken);
      } catch (firebaseError) {
        console.error("Firebase ID Token verification failed:", firebaseError.message);
        throw new ApiError(401, "Unauthorized access - Invalid token");
      }
    }

    // Attach the decoded token payload to the request object
    req.user = decodedToken;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error("Error during token verification:", error.message);

    const errorMessage = error.message.includes("custom token")
      ? "Unauthorized access - Expected a valid token but received an invalid one."
      : `Unauthorized access - ${error.message}`;

    next(new ApiError(401, errorMessage));
  }
};

module.exports = verifyToken;
