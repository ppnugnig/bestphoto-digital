const express = require("express");
const router = express.Router();

// controllers
const { 
   create,
} = require("../controllers/payment");
// middleware
const { auth, } = require("../middleware/auth");

//@Endpoint     http://localhost:5000/api/product
router.post("/payment",auth,create);


module.exports = router;