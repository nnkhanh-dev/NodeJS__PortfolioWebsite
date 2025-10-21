const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const postController = require("../controllers/postController");

// GET / - Homepage
router.get("/", homeController.index);

// GET /blog - Blog list page (must be before /blog/:slug)
router.get("/blog", postController.index);

// GET /blog/category/:slug - Blog by category
router.get("/blog/category/:slug", postController.category);

// GET /blog/:slug - Blog detail page
router.get("/blog/:slug", postController.detail);

module.exports = router;