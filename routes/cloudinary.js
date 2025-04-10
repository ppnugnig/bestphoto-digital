const express = require("express");
const router = express.Router();
const { createImage, deleteImage } = require("../controllers/cloudinary");
const { auth, adminCheck } = require("../middleware/auth");

//@Endpoint     http://localhost:5000/api/images
router.post("/images", auth, adminCheck, createImage);
router.post("/deleteImage", auth, adminCheck, deleteImage);

module.exports = router;
