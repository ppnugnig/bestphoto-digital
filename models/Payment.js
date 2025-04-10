const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const PaymentSchema = new mongoose.Schema(
  {
    bankname: {
      type: String,
    },
    date:{
      type: Date,
    },
    slip: {
        type: Array,
    },
    orderdBy:{
      type:ObjectId,
      ref:'users'
    },
  },
  { timestamps: true }
);
module.exports = Payment = mongoose.model("payment", PaymentSchema);