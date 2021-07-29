const express = require("express");
const authMiddleware = require("../middlewares/authentication");
const orderController = require("../controllers/orders.controller");
const router = express.Router();

/**
 * @route POST api/orders
 * @description User can create order
 * @access Login require
 */
router.post("/", authMiddleware.loginRequired, orderController.createOrder);
/**
 * @route PUT api/orders/:id/update
 * @description User can update order
 * @access Login require
 */
router.put(
  "/:id/update",
  authMiddleware.loginRequired,
  orderController.updateOrder
);

/**
 * @route POST api/order/login
 * @description User can see order detail
 * @access Login required
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  orderController.getDetailOrder
);

/**
 * @route POST api/order/login
 * @description Admin can delete order
 * @access Admin required
 */
router.put("/:id", authMiddleware.loginRequired, orderController.deleteOrder);

module.exports = router;
