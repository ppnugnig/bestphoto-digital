const express = require("express");
const router = express.Router();

//controllers
const {
  register,
  login,
  listUser,
  updateUser,
  deleteUser,
  currentUser,
} = require("../controllers/auth");

//middkeware
const { 
  auth, 
  adminCheck 
} = require("../middleware/auth");

//Route
//@Endpoint http://localhost:5000/api/register
//@Metthod POST ส่งข้อมูล
//@Access  Publish
router.post("/register", register);

//@Endpoint http://localhost:5000/api/login
router.post("/login", login);

//@Endpoint http://localhost:5000/current-user
//@Metthod POST ส่งข้อมูล
//@Access  Private
router.post("/current-user", auth, currentUser);

//@Endpoint http://localhost:5000/current-admin
router.post("/current-admin", auth, adminCheck, currentUser);

//@Endpoint http://localhost:5000/api/auth
//@Metthod GET เรียกดูข้อมูล
//@Access  Publish
router.get("/auth", listUser);

//@Endpoint http://localhost:5000/api/auth
//@Metthod PUT แก้ไข
//@Access  Publish
router.put("/auth", updateUser);

//@Endpoint http://localhost:5000/api/auth
//@Metthod DELETE ลบ
//@Access  Publish
router.delete("/auth", deleteUser);

module.exports = router;
