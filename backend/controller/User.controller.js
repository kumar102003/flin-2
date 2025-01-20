const User = require("../models/user.model");
const uploadOnCloudinary= require("../utils/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../utils/firebaseConfig.js");
const bcrypt = require('bcrypt'); // Import bcrypt for hashing
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const cloudinary = require("cloudinary").v2;

// Helper Function for Input Validation
const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") throw new ApiError(`${key} is required`, 400);
  }
};

// Register User


exports.registerUser = asyncHandler(async (req, res) => {
  const { google, uid, email, password, firstName, lastName, displayName } = req.body;

  if (google) {
    // Handle Google Sign-In
    if (!uid || !email) {
      throw new ApiError("UID and email are required for Google Sign-In", 400);
    }

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(200).json({ message: "User already registered with Google", user: existingUser });
    }

    const nameParts = displayName ? displayName.split(" ") : [];
    const googleUser = await User.create({
      uid,
      email,
      firstName: firstName || nameParts[0] || "",
      lastName: lastName || nameParts[1] || "",
      files: [],
      isSubscribed: false,
    });

    return res.status(201).json({
      message: "User registered successfully using Google.",
      user: googleUser,
    });
  }

  // Handle Email/Password Registration
  if (!email || !password || !firstName || !lastName) {
    throw new ApiError("All fields are required for Email/Password registration", 400);
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const existingUser = await User.findOne({ uid: firebaseUser.uid });
  if (existingUser) {
    throw new ApiError("User already registered", 400);
  }

  const newUser = await User.create({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    password: await bcrypt.hash(password, 10),
    firstName,
    lastName,
    files: [],
    isSubscribed: false,
  });

  res.status(201).json({
    message: "User registered successfully.",
    user: newUser,
  });
});


// Login User
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  validateFields({ email, password });

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Find user in MongoDB
    const user = await User.findOne({ uid: firebaseUser.uid });
    if (!user) {
      throw new ApiError("User not found in the database", 404);
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});

// Logout User
exports.logoutUser = asyncHandler(async (req, res) => {
  try {
    await signOut(auth);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});

// Get User Profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ uid: req.params.uid });
  if (!user) throw new ApiError("User not found", 404);
  
  res.json(user);
});

// Upload File
exports.uploadFile = asyncHandler(async (req, res) => {
  console.log("Request UID:", req.body.uid);

  // Log the file path generated by Multer (or other middleware)
  console.log("File Path:", req.file?.path);
  const user = await User.findOne({ uid: req.body.uid });
  console.log(user)
  if (!user) throw new ApiError("User not found", 404);

  // Check if the user has exceeded their free limit
  if (!user.isSubscribed && user.files.length >= 10) {
    throw new ApiError(403, "Upgrade to subscription to upload more files");
  }

  try {
    const localFilePath = req.file.path; // Assuming multer stores the file path
    console.log(localFilePath)
    const response = await uploadOnCloudinary(localFilePath);
     

    console.log(response)
    user.files.push({ url: response.secure_url, public_id: response.public_id });
    await user.save();

    res.status(201).json({ message: "File uploaded successfully", file: response.secure_url });
  } catch (error) {
    throw new ApiError("Failed to upload file", 500);
  }
});
exports.getFiles = asyncHandler(async (req, res) => {
  // Retrieve user from the request (populated by authMiddleware)
  const user = await User.findOne({ uid: req.params.uid });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Respond with the files array
  res.status(200).json({
    message: "Files retrieved successfully",
    files: user.files,
  });
});
// Delete File
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const { uid, public_id } = req.body;

  if (!uid || !public_id) {
    return next(new ApiError(400, "uid and public_id are required"));
  }

  const user = await User.findOne({ uid });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const fileIndex = user.files.findIndex((file) => file.public_id === public_id);
  if (fileIndex === -1) {
    return next(new ApiError(404, "File not found"));
  }

  try {
    // Delete the file from Cloudinary
    const response = await cloudinary.uploader.destroy(public_id);
    if (response.result !== "ok") {
      return next(new ApiError(500, "Failed to delete file from Cloudinary"));
    }

    // Remove the file from the user's files array
    user.files.splice(fileIndex, 1);
    await user.save();

    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
});
