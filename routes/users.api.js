const express = require("express");
const userController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route GET api/user/me
 * @description Return current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

/**
 * @route GET api/users/:id/order
 * @description Return list orders of current user
 * @access Login required or Admin authorized
 */
router.get(
  "/:id/order",
  authMiddleware.loginRequired,
  userController.getCurrentUserOrder
);

/**
 * @route Put api/users
 * @description User can make a payment
 * @access Login required
 */
router.put("/", authMiddleware.loginRequired, userController.editProfile);

/**
 * @route Put api/users/:id/payment
 * @description User can make a payment
 * @access Login required
 */
router.put(
  "/orders/:id/payment",
  authMiddleware.loginRequired,
  userController.paymentUserOrder
);

/**
 * @route POST api/users/cart
 * @description User can add to cart
 * @access Login required
 */
router.post("/cart", authMiddleware.loginRequired, userController.addToCart);

/**
 * @route PUT api/users/:id/topup
 * @description Top-up user balance
 * @access Login required
 */
router.put(
  "/:id/topup",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  userController.topUpBalance
);

module.exports = router;
