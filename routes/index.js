var express = require("express");
var router = express.Router();

/* Auth route */
const authApi = require("./auth.api");
router.use("/auth", authApi);

/* User route */
const userApi = require("./users.api");
router.use("/users", userApi);
/* Products route */
const productApi = require("./products.api");
router.use("/products", productApi);
/* Order route */
const orderApi = require("./orders.api");
router.use("/orders", orderApi);
/* Categories route */
const categoriesApi = require("./categories.api");
router.use("/categories", categoriesApi);

/* Reviews route */
const reviewsApi = require("./reviews.api");
router.use("/reviews", reviewsApi);

module.exports = router;
