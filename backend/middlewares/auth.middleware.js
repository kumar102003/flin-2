const admin = require("../utils/firebaseConfig.js") ;
const ApiError = require("../utils/ApiError.js") ;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    console.log(token)
    if (!token) {
      throw new ApiError(401, "Unauthorized access - Missing token");
    }

    const decodedToken = await admin.auth().verifyIdToken(token); 
    console.log(decodedToken,"13")
    req.user = decodedToken;
    next(); 
  } catch (error) {
    next(new ApiError(401, "Unauthorized access - Invalid token"));
  }
};

module.exports = verifyToken
