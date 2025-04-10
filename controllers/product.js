const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    const product = await new Product(req.body).save();
    res.send(product);
  } catch (err) {
    res.status(500).send("เกิดข้อผิดพลาดการสร้างสินค้า!!");
  }
};

exports.list = async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    const product = await Product.find()
      .limit(count)
      .populate("category")
      .sort([["createdAt", "desc"]]);
    res.send(product);
  } catch (err) {
    res.status(500).send("เกิดข้อผิดพลาดสินค้า!!");
  }
};
//รายละเอียดสินค้า
exports.listBy = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;

    const product = await Product.find()
      .limit(limit)
      .populate("category")
      .sort([[sort, order]]);

    res.send(product);
  } catch (err) {
    res.status(500).send("เกิดข้อผิดพลาดสินค้า!! listBy");
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    res.send(deleted);
  } catch (err) {
    res.status(500).send("Remove Product Error!!");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id })
      .populate("category")
      .exec();
    res.send(product);
  } catch (err) {
    res.status(500).send("Read Product Error!!");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).exec();
    res.send(product);
  } catch (err) {
    res.status(500).send("Update Product Error!!");
  }
};
//ค้นหาในฐานข้อมูล
const handleQuery = async (req, res, query) => {
  let products = await Product.find({ $text: { $search: query } }).populate(
    "category",
    "_id name"
  );
  res.send(products);
};
const handlePrice = async (req, res, price) => {
  let products = await Product.find({
    price: {
      $gte: price[0],
      $lte: price[1],
    },
  }).populate("category", "_id name");
  res.send(products);
};
const handleCategory = async (req, res, category) => {
  let products = await Product.find({ category }).populate(
    "category",
    "_id name"
  );
  res.send(products);
};

exports.searchFilters = async (req, res) => {
  const handleQuery = async (req, res, query) => {
    try {
      const results = await Product.find({
        name: { $regex: query, $options: "i" }, // ค้นหาด้วยอักษรในชื่อสินค้า
      });
      res.json(results);
    } catch (error) {
      console.error("Error in handleQuery:", error);
      res.status(500).json({ error: "Error processing query." });
    }
  };

  const { query, price, category } = req.body;
  //ค้นหาชื่อ
  if (query) {
    console.log("query", query);
    await handleQuery(req, res, query);
  }
  //ค้นหาราคา
  if (price !== undefined) {
    console.log("price---->", price);
    await handlePrice(req, res, price);
  }
  //ค้นหาหมวดหมู่
  if (category) {
    console.log("category---->", category);
    await handleCategory(req, res, category);
  }
};
