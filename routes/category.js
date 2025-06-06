const express = require("express");
const router = express.Router();

//controllers
const {
    list,
    create,
    read,
    update,
    deletecategory,
} = require("../controllers/category");
// middleware
const { auth, adminCheck } = require("../middleware/auth");

//http://localhost:5000/api/category
router.get('/category', list)
router.post('/category',auth, adminCheck,create)
router.get('/category/:id',auth, adminCheck,read)
router.put('/category/:id',auth, adminCheck,update)
router.delete('/category/:id',auth, adminCheck,deletecategory)

module.exports = router;