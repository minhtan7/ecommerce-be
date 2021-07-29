const Product = require("../models/Products");
const Order = require("../models/Orders");
const Review = require("../models/Reviews");
const utilsHelper = require("../helpers/utils.helper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

reviewControllers = {};

reviewControllers.addReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, content, rating } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product is no longer exist!");
    // check if the user have ever successfully bought that product
    const order = await Order.find({
      $and: [{ userId }, { orderItems: { $elemMatch: { productId } } }],
    });
    console.log(order);
    if (order.length == 0)
      throw new Error(
        "You have to experience the product before leave a reivew. Thank you."
      );
    // check if the user have ever done any reviews on that product
    let review = await Review.find({ userId, productId });
    console.log(review);
    if (review.length > 0)
      throw new Error("You've already reviewed on this product!");
    //4. create a review
    review = await Review.create({
      productId,
      userId,
      content,
      rating,
    });
    //5. push review Id to user docment
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { review },
      null,
      "Review created!"
    );
  } catch (error) {
    next(error);
  }
};

reviewControllers.getReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id);
    if (!review) throw new Error("Review not found");
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { review },
      null,
      "Get single review"
    );
  } catch (error) {
    next(error);
  }
};

reviewControllers.updateReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    const { content, rating } = req.body;
    //check if the review is still exists
    let review = await Review.findById(id);
    if (!review) throw new Error("The review is no longer exists!");
    console.log(review.userId);
    console.log(userId);
    //check if that review is written by current user
    if (review.userId.toString() != userId) {
      throw new Error("User not authorized to edit this review!");
    }

    review = await Review.findByIdAndUpdate(
      id,
      {
        content,
        rating,
      },
      { new: true }
    );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { review },
      null,
      "Review updated!"
    );
  } catch (error) {
    next(error);
  }
};

reviewControllers.deleteReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    let review = await Review.findById(id);
    if (!review) throw new Error("The review is no longer exists!");
    console.log(review.userId);
    console.log(userId);
    //check if that review is written by current user
    if (review.userId.toString() != userId) {
      throw new Error("User not authorized to delete this review!");
    }

    await Review.remove({ _id: id });
    utilsHelper.sendResponse(res, 200, true, null, null, "Review deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = reviewControllers;
