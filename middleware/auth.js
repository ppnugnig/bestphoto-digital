const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = (req, res, next) => {
  try {
    const token = req.headers["authtoken"];
    if (!token) {
      return res.status(401).send("ไม่มีโทเค็น การอนุญาตถูกปฏิเสธ auth");
    }
    const decoded = jwt.verify(token, "jwtSecret");
    console.log("middleware", decoded);
    req.user = decoded.user;
    next();

  } catch (err) {
    console.log(err);
    res.status(401).send("โทเค็นไม่สามารถใช้งานได้!");
  }
};

exports.adminCheck = async(req, res, next) => {
  try {
    const { username } = req.user
    const adminUser = await User.findOne({username}).exec();
    if (adminUser.role !== 'admin' ){
      res.status(403).send("ขออภัย คุณไม่ใช่แอดมิน คุณไม่มีสิทธิเข้าถึงข้อมูล!")
    } else {
      next()
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("คุณไม่ใช่แอดมิน คุณไม่มีสิทธิเข้าถึงข้อมูล!!");
  }
};