const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @route POST api/auth/register
 * @description User can register with email and password
 * @access Public
 */
router.post("/register", authController.register);

/**
 * @route POST api/auth/login
 * @description User can login with email and password
 * @access Public
 */
router.post("/login", authController.loginWithEmail);

module.exports = router;
