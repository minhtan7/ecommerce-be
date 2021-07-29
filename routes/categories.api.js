const express = require("express");
const categoryController = require("../controllers/categories.controller");
const authMiddleware = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route GET api/category
 * @description user can get all categories
 * @access public
 */
router.get("/", categoryController.getAllCat);

/**
 * @route POST api/category
 * @description admin can create new category
 * @access admin required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  categoryController.createCat
);

/**
 * @route PUT api/category/:id
 * @description admin can update category
 * @access admin required
 */
/* s */

/**
 * @route DELETE api/category/:id
 * @description admin can delete category
 * @access admin required
 */
router.delete(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  categoryController.deleteCat
);

module.exports = router;
