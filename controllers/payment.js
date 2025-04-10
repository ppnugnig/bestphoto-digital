const Payment = require('../models/Payment')

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    const payment = await new Payment(req.body).save();
    res.send(payment);
  } catch (err) {
    res.status(500).send("เกิดข้อผิดพลาดการชำระเงิน");
  }
};