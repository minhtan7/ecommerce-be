const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = Schema(
  {
    name: { type: String, require: false },
    price: { type: Number, require: true },
    stock: { type: Number, require: true, default: 50 },
    imageUrls: [
      {
        type: String,
        require: true,
      },
    ],
    description: { type: String, require: true },
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Reviews" }],
    avgRating: { type: Number, require: true, default: 0 },
    categories: [{ type: mongoose.Types.ObjectId, ref: "Categories" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("Products", productsSchema);
module.exports = Products;
