const express = require('express');
const { getProfile, uploadFile , loginUser, registerUser ,getFiles,deleteFile,handlePayment} = require('../controller/User.controller.js');
const upload = require('../middlewares/multer.middleware.js');
const authMiddleware = require("../middlewares/auth.middleware.js"); 
const verifyToken = require('../middlewares/auth.middleware.js');


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
//router.post("/logout", logoutUser);


router.get('/profile',verifyToken, getProfile);
router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/files",verifyToken, getFiles);
router.delete('/delete', verifyToken,deleteFile);
router.post("/payment",handlePayment)

module.exports = router;

