const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    userId: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    content: { type: String, required: true, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", reviewSchema);
module.exports = Reviews;
