const Orders = require("../models/Orders");
const Users = require("../models/Users");
const Products = require("../models/Products");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const orderController = {};

orderController.createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log(userId);
    let user = await Users.findById(userId).populate({
      path: "cart",
      populate: "productId",
    });
    if (!user) throw new Error("User not exists");

    const total = user.cart.reduce((total, product) => {
      if (product.quantity > product.productId.stock)
        throw new Error("Sold out");
      return total + product.quantity * product.productId.price;
    }, 0);

    const orderItems = user.cart.map((product) => {
      return {
        name: product.productId.name,
        description: product.productId.description,
        price: product.productId.price,
        imageUrls: product.productId.imageUrls,
        quantity: product.quantity,
        productId: product.productId._id,
      };
    });
    const order = await Orders.create({ userId, orderItems, total }); // later should use aggregation

    // user.cart.forEach(async (product) => {
    //   const p = await Products.findById(product.productId._id);
    //   p.stock -= product.quantity;
    //   await p.save();
    // });
    user.cart = [];
    user.orders.push(order._id);
    user.save();

    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order created");
  } catch (error) {
    next(error);
  }
};

orderController.getDetailOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return next(new Error("401- Order not found"));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "Get detail order"
    );
  } catch (error) {
    next(error);
  }
};

orderController.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { products, total } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { products, total },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "order send");
  } catch (error) {
    next(error);
  }
};
//

orderController.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
      },
      { isDeleted: true },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, null, null, "Order deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = orderController;
