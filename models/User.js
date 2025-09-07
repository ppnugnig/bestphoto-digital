const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
    },
    LastName: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "customer",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    houseNum:{
      type: String
    },
    moo:{
      type: String
    },
    province:{
      type: String
    },
    district: {
      type: String,
    },
    subDistrict: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    tel: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("users", UserSchema);
