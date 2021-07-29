const express = require("express");
const authMiddleware = require("../middlewares/authentication");
const reviewControllers = require("../controllers/reviews.controller");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route POST api/reviews
 * @description user can add a review to product after order that product
 * @access login required
 */
router.post("/", authMiddleware.loginRequired, reviewControllers.addReview);

/**
 * @route GET api/reviews/:id
 * @description user can get single review (for update)
 * @access public
 */
router.get("/:id", authMiddleware.loginRequired, reviewControllers.getReview);

/**
 * @route PUT api/reviews/:id
 * @description user can update a review to product after order that product
 * @access login required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  reviewControllers.updateReview
);

/**
 * @route DELETE api/reviews/:id
 * @description user can delete a review to product after order that product
 * @access login required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  reviewControllers.deleteReview
);

module.exports = router;
