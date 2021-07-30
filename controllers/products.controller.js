const utilsHelper = require("../helpers/utils.helper");
const Product = require("../models/Products");
const Reviews = require("../models/Reviews");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const productController = {};

productController.getAllProducts = async (req, res, next) => {
  try {
    let { page, limit, sortBy, search } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = limit * (page - 1);
    let totalProducts;
    let products;
    let totalPages;
    if (search) {
      totalProducts = await Product.find({
        name: { $regex: new RegExp(search, "i") },
      }).countDocuments();
      totalPages = Math.ceil(totalProducts / limit);

      products = await Product.find({
        name: { $regex: new RegExp(search, "i") },
      })
        .skip(offset)
        .limit(limit)
        .populate("categories", "name")
        .populate("reviews");
      // products = await Product.aggregate([
      //   {
      //     $lookup: {
      //       from: "Reviews",
      //       localField: "reviews",
      //       foreignField: "_id",
      //       as: "reviews",
      //     },
      //   },
      //   { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
      //   { $sort: { avgRating: 1 } },
      // ]);
      // console.log(products);

      // await products.save();
      // products = await Product.find({
      //   name: { $regex: new RegExp(search, "i") },
      // })
      //   .skip(offset)
      //   .limit(limit)
      //   .populate("categories", "name -_id")
      //   .populate("reviews", "-_id")
      //   .sort({ avgRating: sortBy });
    } else {
      totalProducts = await Product.find().countDocuments();
      totalPages = Math.ceil(totalProducts / limit);

      products = await Product.find()
        .skip(offset)
        .limit(limit)
        .populate("categories", "name")
        .populate("reviews");
    }
    // } else if (search) {
    // } else if (sortBy) {
    // } else {
    // }

    // const totalProducts = await Product.count({ isDeleted: false });

    // const totalPages = Math.ceil(totalProducts / limit);
    // const offset = limit * (page - 1);

    // const products = await Product.find().skip(offset).limit(limit);
    let productIds = products.map((product) => product._id);
    await Reviews.aggregate(
      [
        { $match: { productId: { $in: productIds } } },
        { $group: { _id: `$productId`, avgRating: { $avg: "$rating" } } },
      ],
      function (err, results) {
        results.forEach((r) => {
          let productIndex = products.findIndex(
            (p) => p._id.toString() === r._id.toString()
          );
          console.log("hehe", productIndex);
          products[productIndex].avgRating = r.avgRating;
          console.log(products[5]);
        });
      }
    );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, totalPages },
      null,
      "Get all products"
    );
  } catch (error) {
    next(error);
  }
};

productController.getProductsByCategories = async (req, res, next) => {
  try {
    let { page, limit, search } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = limit * (page - 1);
    let categoryId = req.params.id;
    let totalProducts;
    let products;
    let totalPages;
    if (search) {
      totalProducts = await Product.find({
        name: { $regex: new RegExp(search, "i") },
        categories: { $elemMatch: { $eq: categoryId } },
      }).countDocuments();
      totalPages = Math.ceil(totalProducts / limit);

      products = await Product.find({
        name: { $regex: new RegExp(search, "i") },
        categories: { $elemMatch: { $eq: categoryId } },
      })
        .skip(offset)
        .limit(limit)
        .populate("categories", "name")
        .populate("reviews");
    } else {
      totalProducts = await Product.find({
        categories: { $elemMatch: { $eq: categoryId } },
      }).countDocuments();
      totalPages = Math.ceil(totalProducts / limit);
      products = await Product.find({
        categories: { $elemMatch: { $eq: categoryId } },
      })
        .skip(offset)
        .limit(limit)
        .populate("categories", "name")
        .populate("reviews");
    }

    let productIds = products.map((product) => product._id);
    await Reviews.aggregate(
      [
        { $match: { productId: { $in: productIds } } },
        { $group: { _id: `$productId`, avgRating: { $avg: "$rating" } } },
      ],
      function (err, results) {
        results.forEach((r) => {
          let productIndex = products.findIndex(
            (p) => p._id.toString() === r._id.toString()
          );
          console.log("hehe", productIndex);
          products[productIndex].avgRating = r.avgRating;
          console.log(products[5]);
        });
      }
    );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, totalPages },
      null,
      "Get by Categories"
    );
  } catch (error) {
    next(error);
  }
};

productController.addProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, imageUrls, categories } = req.body;

    const products = await Product.create({
      name,
      stock,
      description,
      price,
      imageUrls,
      categories,
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products },
      null,
      "Product created"
    );
  } catch (error) {
    next(error);
  }
};

productController.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, price, imageUrls } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        imageUrls,
        categories,
      },
      {
        new: true,
      }
    );
    if (!product) {
      return next(new Error("Product not found"));
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product updated"
    );
  } catch (error) {
    next(error);
  }
};
productController.getSingleProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Get detail of single product"
    );
  } catch (error) {
    next(error);
  }
};

productController.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }
    await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true }
    );
    utilsHelper.sendResponse(res, 200, true, null, null, "Product deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = productController;
