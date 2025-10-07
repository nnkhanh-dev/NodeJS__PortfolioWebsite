const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET /auth/login
router.get("/login", authController.login);

// POST login
router.post('/login', authController.loginPost);

// GET logout
router.get('/logout', authController.logout);

module.exports = router;