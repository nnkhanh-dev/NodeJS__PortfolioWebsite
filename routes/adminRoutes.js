const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const dashboardController = require('../controllers/dashboardController');
const techTypeRoutes = require('./admin/techtypeRoutes');
const techRoutes = require('./admin/technicalRoutes');
const educationRoutes = require('./admin/educationRoutes');
const experienceRoutes = require('./admin/experienceRoutes');
const socialRoutes = require('./admin/socialRoutes');
const projectRoutes = require('./admin/projectRoutes');
const userRoutes = require('./admin/userRoutes');
const categoryPostRoutes = require('./admin/categoryPostRoutes');
const postRoutes = require('./admin/postRoutes');
const uploadRoutes = require('./admin/uploadRoutes');


router.get('/dashboard', isAdmin, dashboardController.index);

router.use('/tech-types', techtypeRoutes);
router.use('/technicals', techRoutes);
router.use('/educations', educationRoutes);
router.use('/experiences', experienceRoutes);
router.use('/socials', socialRoutes);
router.use('/projects', projectRoutes);
router.use('/user', userRoutes);
router.use('/category-posts', categoryPostRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
