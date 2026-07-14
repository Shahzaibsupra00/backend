const express = require("express");

const {
  Register,
  Login,
  Logout,
  VerifyAuth,
} = require("../controllers/user.controller.js");

const router = express.Router();

// Register user
router.post("/register", Register);
// Login user
router.post("/login", Login);
// Logout user
router.post("/logout", Logout);
// Verify authentication
router.get("/verify", VerifyAuth);

module.exports = router;
