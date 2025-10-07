const express = require("express");
const router = express.Router();

// Import từng nhóm route
const homeRoutes = require("./homeRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");

// Gắn prefix cho từng nhóm route
router.use("/", homeRoutes);
router.use("/auth", authRoutes);
router.use("/admin", require("./adminRoutes"));

module.exports = router;