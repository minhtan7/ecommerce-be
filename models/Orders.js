const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    orderItems: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrls: [
          {
            type: String,
            require: true,
          },
        ],
        quantity: { type: Number, required: true },
        productId: { type: Schema.Types.ObjectId, required: true },
      },
    ],
    total: { type: Number, default: 0 },
    status: {
      type: String,
      emum: ["pending", "cancel", "paid", "confirmed", "delivery", "done"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamp: true }
);
orderSchema.plugin(require("./plugins/isDeletedFalse"));

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
