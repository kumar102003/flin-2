const express = require('express');
const { getProfile, uploadFile , loginUser, registerUser, logoutUser ,getFiles,deleteFile} = require('../controller/user.controller.js');
const upload = require('../middlewares/multer.middleware.js');
const authMiddleware = require("../middlewares/auth.middleware.js"); 
const verifyToken = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get('/profile/:uid', getProfile);
router.post('/upload', upload.single('file'), uploadFile);
router.get("/files/:uid", getFiles);
router.delete('/delete', deleteFile);


module.exports = router;

