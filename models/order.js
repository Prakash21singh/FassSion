const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  iPrice: {
    type: Number,
    required: true,
  },
  fPrice: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  userOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Order", orderSchema);
