const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');

router.get('/dashboard', isAdmin, (req, res) => {
  res.render('admin/dashboard', {
    layout: 'admin', // Dùng layout riêng cho admin
    title: 'Admin Dashboard',
    user: req.user,
  });
});


module.exports = router;
