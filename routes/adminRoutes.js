const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const techTypeRoutes = require('./admin/techtypeRoutes');

router.get('/dashboard', isAdmin, (req, res) => {
  res.render('admin/dashboard', {
    layout: 'admin', // Dùng layout riêng cho admin
    title: 'Admin Dashboard',
    user: req.user,
  });
});

router.use('/tech-types', techTypeRoutes);


module.exports = router;
