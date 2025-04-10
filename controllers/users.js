const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//import models
const User = require("../models/User");
const Product = require("../models/product");
const Cart = require("../models/Cart");
const Order = require("../models/Order")

const mongoose = require("mongoose");

exports.listUsers = async (req, res) => {
  try {
    const user = await User.find({}).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด! listUsers1");
  }
};

exports.readUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด! readUsers");
  }
};

exports.updateUsers = async (req, res) => {
  try {
    var {id, password} = req.body.values
    const salt = await bcrypt.genSalt(10);
    var enPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { _id: id },
      { password: enPassword }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!updateUsers1");
  }
};

exports.removeUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด! removeUsers");
  }
};

exports.changeStatus = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { enabled: req.body.enabled }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!!changeStatus");
  }
};

exports.changeRole = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { role: req.body.role }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!changeRole!");
  }
};

exports.userCart = async (req, res) => {
  try {
    const {cart} = req.body;
    let user = await User.findOne({username: req.user.username}).exec(); //check user
    let products = [] //array
    let cartOld = await Cart.findOne({ orderdBy: user._id }).exec(); //เช็คตะกร้าเก่า
    if (cartOld) {
      await Cart.deleteOne({ _id: cartOld._id }); //ลบตะกร้าเก่า
      // console.log("delete cart old");
    }
    //ให้loopแต่งสินค้า เอาแค่  ไอดีสินค้า จำนวน ราคา
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.price = cart[i].price;
      products.push(object); //เอา object พุต ลงarray products
    }
    let cartTotal = 0; //รวมราคาสินค้าในตะกร้า
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
     }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderdBy: user._id,
    }).save();
    console.log(newCart);
    res.send("Cart OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("userCart ผิดพลาด");
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({username: req.user.username}).exec()

    let cart = await Cart.findOne({orderdBy:user._id})
    .populate('products.product', '_id name price')
    .exec()

    const {products, cartTotal} = cart
    res.json({products,cartTotal})


  } catch (err) {
    console.log(err);
    res.status(500).send("getUserCart ผิดพลาด");
  }
};

exports.Address = async (req, res) => {
  try {
    const userAddress = await User.find(
      { username: req.user.username }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).send("saveAddress Error");
  }
};
exports.saveOrder = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.user.username }).exec();

    let userCart = await Cart.findOne({ orderdBy: user._id }).exec();
    //save order
    let order = await new Order({
      products: userCart.products,
      orderdBy: user._id,
      cartTotal: userCart.cartTotal,
    }).save();

    //บวก ลบ จำนวน products
    let bulkOption = userCart.products.map((item) => {
      return {
        updateOne: {
          filter:{ _id: item.product._id },
          update:{ $inc:{quantity: -item.count, sold : +item.count}}
        }
      }
    })
    let updatedProdQ = await Product.bulkWrite(bulkOption, {})

    res.send(updatedProdQ);
  } catch (err) {
    res.status(500).send("Save Order Error");
  }
};
exports.emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({username: req.user.username}).exec();
    if (!user) {
      return res.status(404).send("ไม่พบผู้ใช้");
    }
     // ค้นหาและลบตะกร้า
    const emptyC = await Cart.findOneAndDelete({orderdBy:user._id}).exec();
    // ถ้าไม่พบ Cart ที่จะลบ
    if (!emptyC) {
      return res.status(404).send("ไม่พบตะกร้า");
    }
    res.send({ message: "ลบตะกร้าสำเร็จ", deletedCart: emptyC });
  } catch (err) {
    console.log(err);
    res.status(500).send("delete cart ผิดพลาด");
  }
};

exports.userProfile =async (req,res) => {
  try {
    let user = await User.findOne({ username: req.User.username }).exec();

    if (!user) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }

     const userProfile = {
      firstName: user.FirstName,
      lastName: user.LastName,
      username: user.username,
      password: user.password,  // แนะนำให้ไม่ส่งรหัสผ่านใน API จริงๆ
      address: user.address
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }

  
}

exports.getOrders = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    let order = await Order.find({ orderdBy: user._id })
      .populate("products.product")
      .exec();
    res.json(order)
  } catch (err) {
    res.status(500).send("get Order Error");
  }
};