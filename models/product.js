const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
    unique: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdUser: {
    type: String,
    required: true,
    default: "FassSion",
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
