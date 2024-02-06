const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product: {
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
  category: {
    type: String,
    enum: ["Sweater", "Hoodies", "Sweatshirt", "Jackets", "Pants"],
    required: true,
  },
  img: {
    type: "String",
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
