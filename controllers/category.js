const Category = require("../models/category");

exports.list = async (req, res) => {
  try {
    const category = await Category.find({}).exec();
    res.send(category);
  } catch (err) {
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!!");
  }
};
exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name }).save();
    res.send(category);
  } catch (err) {
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!!");
  }
};
exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({ _id: id });
    res.send(category);
  } catch (err) {
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!!");
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { name: name }
    );
    res.send(category);
  } catch (err) {
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!!");
  }
};
exports.deletecategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findOneAndDelete({ _id: id });
    res.send(category);
  } catch (err) {
    res.status(500).send("เซิร์ฟเวอร์ผิดพลาด!!");
  }
};
