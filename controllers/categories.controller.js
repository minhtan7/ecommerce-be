const Category = require("../models/Categories");
const utilsHelper = require("../helpers/utils.helper");

const categoryController = {};

categoryController.getAllCat = async (req, res, next) => {
  try {
    let { page, limit } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = limit * (page - 1);

    let totalCategories = await Category.find().countDocuments();
    totalPages = Math.ceil(totalCategories / limit);

    const categories = await Category.find();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { categories, totalPages },
      null,
      "Get all category succeffuly"
    );
  } catch (error) {
    next(error);
  }
};

categoryController.createCat = async (req, res, next) => {
  try {
    const { name, parentCategoryId = null } = req.body;
    /* let category = await Category.findOne({ name });
    if (category) throw new Error("Category is already exists"); */
    // let category = await Category.findOneAndUpdate(
    //   { name },
    //   {
    //     $set: {
    //       name,
    //       parentCategory: parentCategoryId,
    //     },
    //   },
    //   { upsert: true, new: true }
    // );
    let category = await Category.findOneAndUpdate(
      { name },
      {
        $set: {
          name,
        },
      },
      { upsert: true, new: true }
    );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { category },
      null,
      "Category successfully created"
    );
  } catch (error) {
    next(error);
  }
};

/* categoryController.UpdateCat = async (req, res, next) => {
  try {
    const { name, parentCategoryId = null } = req.body;
    let category = await Category.findOne({ name });
    if (category) throw new Error("Category is already exists");
    category = await Category.create({
      name,
      parentCategory: parentCategoryId,
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { category },
      null,
      "Category successfully created"
    );
  } catch (error) {
    next(error);
  }
}; */

categoryController.deleteCat = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Category.findByIdAndUpdate(
      { name },
      { isDeleted: true },
      { new: true }
    );
    //find all the category id then delete in Category and Product
    utilsHelper.sendResponse(res, 200, true, null, null, "Category deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = categoryController;
