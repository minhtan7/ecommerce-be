const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const Orders = require("../models/Orders");
const Products = require("../models/Products");

const userController = {};

userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    let user = await Users.findById(userId).populate("orders").populate({
      path: "cart",
      populate: "productId",
    });
    if (!user) throw new Error("User not exists");

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      `Get ${user.name} information`
    );
  } catch (err) {
    next(err);
  }
};

userController.editProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    let { name, email, avatarUrl } = req.body;
    if (!avatarUrl) {
      avatarUrl =
        "https://res.cloudinary.com/tanvo/image/upload/v1627371374/coderschool/anonymus_avatar_unisex_rogach.jpg";
    }
    let user = await Users.findById(userId);
    if (!user) throw new Error("User not exists");
    user = await Users.findByIdAndUpdate(
      userId,
      { name, email, avatarUrl },
      { new: true }
    );

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      `Update ${user.name} information`
    );
  } catch (err) {
    next(err);
  }
};

userController.addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    let user = await Users.findById(userId);
    if (!user) throw new Error("User not exists");

    let product = await Products.findById(productId);
    if (!product) throw new Error("Product not found");

    let match = false;
    user.cart = await Promise.all(
      user.cart.map(async (c) => {
        if (c.productId.toString() == productId) {
          const totalQty = quantity + c.quantity;
          console.log("here", totalQty);
          product = await Products.find({
            _id: productId,
            stock: { $gte: totalQty },
          });
          if (product) {
            c.quantity += quantity;
            match = true;
          }
          if (c.quantity <= 0) {
            return null;
          }
        }
        return c;
      })
    );
    user.cart = user.cart.filter((c) => c != null);
    if (match == true) {
      await user.save();
    } else {
      if (quantity < 0) throw new Error("Can not add to cart");
      user = await Users.findByIdAndUpdate(
        userId,
        { $push: { cart: { productId, quantity } } },
        { new: true }
      );
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      `Add product to cart`
    );
  } catch (err) {
    next(err);
  }
};

//Get order of current user
userController.getCurrentUserOrder = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = { ...req.query };

    page = parseInt(page) || 1;
    limit = parseIng(limit) || 10;

    const totalOrders = await Orders.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);

    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    const userId = req.params.id;

    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(
        new Error("401- only admin able to check other user Order detail")
      );
    }

    const order = await Orders.find({ userId })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);

    if (!order) return next(new Error(`401- ${user} has no order`));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order, totalPages },
      null,
      "Get order from userId success"
    );
  } catch (error) {
    next(error);
  }
};

userController.paymentUserOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId;

    let order = await Orders.findById(orderId);
    let user = await Users.findById(userId);
    const total = order.total;
    const funds = user.balance;
    if (total > funds) {
      console.log("sth here4");
      throw new Error("403-Insufficient balance");
    } else {
      user = await Users.findByIdAndUpdate(
        userId,
        { balance: funds - total },
        { new: true }
      );
      console.log("sth here");
      // order = Orders.findByIdAndUpdate(
      //   orderId,
      //   { status: "paid" },
      //   { new: true }
      // );
      order.status = "paid";
      await order.save();

      Promise.all(
        user.cart.forEach(async (product) => {
          const p = await Products.findById(product.productId._id);
          p.stock -= product.quantity;
          await p.save();
          console.log("sth here 2");
        })
      );
      console.log("sth here 3");

      utilsHelper.sendResponse(
        res,
        200,
        true,
        { user },
        null,
        "Payment success"
      );
    }
  } catch (error) {
    next(error);
  }
};

userController.topUpBalance = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { topup } = req.body;
    let user = await Users.findById(userId);
    if (!user) return next(new Error("User not found"));

    user = await Users.findByIdAndUpdate(
      userId,
      {
        balance: balance + topup,
      },
      { new: true }
    );

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Successfully top up User balance"
    );
  } catch (error) {
    next(error);
  }
};

userController.deleteCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    let user = await Users.findById(userId);
    if (!user) return next(new Error("User not found"));

    user = await Users.findByIdAndUpdate(userId, { cart: [] }, { new: true });

    utilsHelper.sendResponse(res, 200, true, { user }, null, "Cart deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
