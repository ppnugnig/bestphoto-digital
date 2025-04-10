const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    //เช็คชื่อผู้ใช้ใน db
    const { FirstName, LastName, username, password, houseNum, moo, province, district, subDistrict, zipcode, tel } = req.body;
    var user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("ชื่อผู้ใช้งานซ้ำ กรุณาลองใหม่อีกครั้ง!");
    }
    const salt = await bcrypt.genSalt(10);
    user = new User({
      FirstName,
      LastName,
      username,
      password,
      houseNum, 
      moo, 
      province, 
      district, 
      subDistrict, 
      zipcode, 
      tel,
    });
    //การเข้ารหัส
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.send("การลงทะเบียนเรียบร้อยแล้ว!");
  } catch {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด! register");
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    var user = await User.findOneAndUpdate({ username }, { new: true });
    if (user && user.enabled) {
      //เช็ครหัสผ่าน
      const matchPass = await bcrypt.compare(password, user.password);
      if (!matchPass) {
        return res.status(400).send("รหัสผ่านไม่ถูกต้อง!");
      }
      const payload = {
        user: {
          username: user.username,
          role: user.role
        },
      };
      // token
      jwt.sign(payload, "jwtSecret", { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    } else {
      return res
        .status(400)
        .send("ไม่พบชื่อผู้ใช้งานนี้ กรุณาลองใหม่อีกครั้ง!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด! login");
  }
};
exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username })
      .select("-password")
      .exec();
    console.log('user', user)
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.listUser = async (req, res) => {
  try {
    res.send("List Get User");
  } catch {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!listuser");
  }
};

exports.updateUser = async (req, res) => {
  try {
    res.send("Update User");
  } catch {
    console.log(err);
    res.status(500).send("Server Error!!!");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    res.send("Delete User");
  } catch {
    console.log(err);
    res.status(500).send("Server Error!!!");
  }
};
