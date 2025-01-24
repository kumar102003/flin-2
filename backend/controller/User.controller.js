const admin = require("../utils/firebaseConfig"); // Firebase Admin SDK
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const uploadOnCloudinary = require("../utils/cloudinary");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// Helper Function to Validate Required Fields
const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") throw new ApiError(`${key} is required`, 400);
  }
};


const generateToken = (uid, email) => {
  return jwt.sign(
    { uid, email }, // Payload
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: "24h" } // Token expiration (adjust as needed)
  );
};
// **Register User**
// exports.registerUser = asyncHandler(async (req, res) => {
//   const { google, idToken, email, password, firstName, lastName, displayName } = req.body;

//   // Handle Google Sign-In
//   if (google) {
//     if (!idToken) {
//       throw new ApiError("Google ID token is required for Google Sign-In", 400);
//     }

//     try {
//       // Verify the Google ID token using Firebase Admin SDK
//       const decodedToken = await admin.auth().verifyIdToken(idToken);
//       const uid = decodedToken.uid;

//       // Check if the user already exists in MongoDB
//       let user = await User.findOne({ uid });


//       if (!user) {
//         // First-time Google user, create a new record in MongoDB
//         const nameParts = displayName ? displayName.split(" ") : [];
//         user = await User.create({
//           uid,
//           email: decodedToken.email,
//           firstName: firstName || nameParts[0] || "",
//           lastName: lastName || nameParts[1] || "",
//           files: [],
//           isSubscribed: false,
//         });
//       }

//       // Return the user data without JWT token for now
//       return res.status(201).json({
//         message: "User registered successfully using Google.",
//         user,
//       });
//     } catch (error) {
//       console.error("Error during Google Sign-In:", error.message);
//       throw new ApiError(`Google Sign-In failed: ${error.message}`, 400);
//     }
//   }

//   // Handle Email/Password Registration
//   if (!email || !password || !firstName || !lastName) {
//     throw new ApiError("All fields are required for Email/Password registration", 400);
//   }

//   try {
//     // Create a new user in Firebase Authentication
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//       displayName: `${firstName} ${lastName}`,
//     });

//     // Hash the password and save the user details in MongoDB
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({
//       uid: userRecord.uid,
//       email: userRecord.email,
//       password: hashedPassword,
//       firstName,
//       lastName,
//       files: [],
//       isSubscribed: false,
//     });

//     res.status(201).json({
//       message: "User registered successfully.",
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Error during Email/Password Registration:", error.message);
//     throw new ApiError(`Registration failed: ${error.message}`, 400);
//   }
// });


// // **Login User**
// exports.loginUser = asyncHandler(async (req, res) => {
//   const { idToken } = req.body;

//   if (!idToken) {
//     throw new ApiError("ID token is required for login", 400);
//   }

//   try {
//     // Verify the ID token using Firebase Admin SDK
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;

//     // Check if the user exists in MongoDB
//     const user = await User.findOne({ uid });
//     if (!user) {
//       throw new ApiError("User not found in the database", 404);
//     }

//     res.status(200).json({
//       message: "Login successful",
//       user,
//     });
//   } catch (error) {
//     console.error("Error during login:", error.message);
//     throw new ApiError(`Login failed: ${error.message}`, 400);
//   }
// });
exports.registerUser = asyncHandler(async (req, res) => {
  const { google, idToken, email, password, firstName, lastName, displayName } = req.body;

  // Handle Google Sign-In
  if (google) {
    if (!idToken) {
      throw new ApiError("Google ID token is required for Google Sign-In", 400);
    }

    try {
      // Verify the Google ID token using Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Check if the user already exists in MongoDB
      let user = await User.findOne({ uid });

      if (!user) {
        // First-time Google user, create a new record in MongoDB
        const nameParts = displayName ? displayName.split(" ") : [];
        user = await User.create({
          uid,
          email: decodedToken.email,
          firstName: firstName || nameParts[0] || "",
          lastName: lastName || nameParts[1] || "",
          files: [],
          isSubscribed: false,
        });
      }

      // Generate JWT token
      const token = generateToken(user.uid, user.email);
   console.log("google ",token);
      // Return the user data with JWT token
      return res.status(201).json({
        message: "User registered successfully using Google.",
        user,
        token, // Include JWT token
      });
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
      throw new ApiError(`Google Sign-In failed: ${error.message}`, 400);
    }
  }

  // Handle Email/Password Registration
  if (!email || !password || !firstName || !lastName) {
    throw new ApiError("All fields are required for Email/Password registration", 400);
  }

  try {
    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Hash the password and save the user details in MongoDB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      uid: userRecord.uid,
      email: userRecord.email,
      password: hashedPassword,
      firstName,
      lastName,
      files: [],
      isSubscribed: false,
    });

    // Generate JWT token
    const token = generateToken(newUser.uid, newUser.email);
    console.log("email ",token);
    res.status(201).json({
      message: "User registered successfully.",
      user: newUser,
      token, // Include JWT token
    });
  } catch (error) {
    console.error("Error during Email/Password Registration:", error.message);
    throw new ApiError(`Registration failed: ${error.message}`, 400);
  }
});
exports.loginUser = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError("ID token is required for login", 400);
  }

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if the user exists in MongoDB
    const user = await User.findOne({ uid });
    if (!user) {
      throw new ApiError("User not found in the database", 404);
    }

    // Generate JWT token
    const token = generateToken(user.uid, user.email);
   console.log("Login" , token);
    res.status(200).json({
      message: "Login successful",
      user,
      token, // Include JWT token
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    throw new ApiError(`Login failed: ${error.message}`, 400);
  }
});


// **Get User Profile**
exports.getProfile = asyncHandler(async (req, res) => {
  // Assuming `req.user` is populated by `verifyToken` middleware
  const { uid } = req.user;


  // Find user in the database
  const user = await User.findOne({ uid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Respond with user details
  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    user,
  });
});
// **Upload File**
exports.uploadFile = asyncHandler(async (req, res) => {
  const { uid } = req.user; // Extract the authenticated user's `uid` from the token

  // Validate if the user exists
  const user = await User.findOne({ uid });
  if (!user) throw new ApiError("User not found", 404);

  // Check if the user has exceeded their free file limit
  if (!user.isSubscribed && user.files.length >= 10) {
    throw new ApiError(403, "Upgrade to subscription to upload more files");
  }

  try {
    const localFilePath = req.file.path; // Assuming Multer is used for file uploads
    const response = await uploadOnCloudinary(localFilePath);

    // Add the uploaded file to the user's `files` array
    user.files.push({
      url: response.secure_url,
      public_id: response.public_id,
    });
    await user.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file: response.secure_url,
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw new ApiError("Failed to upload file", 500);
  }
});

// **Get User Files**
exports.getFiles = asyncHandler(async (req, res) => {
  // Extract `uid` from `req.user` (populated by the `verifyToken` middleware)
  const { uid } = req.user;

  // Find the user in the database
  const user = await User.findOne({ uid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Respond with the user's files
  res.status(200).json({
    message: "Files retrieved successfully",
    files: user.files,
  });
});

// **Delete File**
exports.deleteFile = asyncHandler(async (req, res) => {
  const { public_id } = req.body; // Retrieve the public_id of the file to delete
  const { uid } = req.user; // Retrieve uid from verifyToken middleware

  // Find the user in the database
  const user = await User.findOne({ uid });
  if (!user) throw new ApiError("User not found", 404);

  // Find the file in the user's files array
  const fileIndex = user.files.findIndex((file) => file.public_id === public_id);
  if (fileIndex === -1) throw new ApiError("File not found", 404);

  try {
    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Remove the file from the user's files array
    user.files.splice(fileIndex, 1);
    await user.save();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    throw new ApiError("Failed to delete file", 500);
  }
});
exports.handlePayment = asyncHandler(async (req, res) => {
  const { product } = req.body;

  if (!product || !product.price) {
    return res.status(400).json({ message: "Product and price are required." });
  }

  try {
    // Convert price to cents (Stripe requires amount in cents)
    const amount = parseInt(product.price.replace("$", "")) * 100;

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Price in cents
      currency: "usd",
      description: `Payment for ${product.name}`, // Corrected string interpolation
      metadata: { product: product.name },
    });

    // Respond with the client secret
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment Error:", error.message);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
});
