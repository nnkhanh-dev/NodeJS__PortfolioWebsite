const User = require('../models/User');

// Middleware để thêm user vào res.locals cho tất cả views
module.exports = async function (req, res, next) {
  if (req.isAuthenticated()) {
    try {
      // Lấy dữ liệu mới nhất từ database
      const freshUser = await User.findById(req.user._id).lean();
      res.locals.user = freshUser || req.user;
    } catch (error) {
      console.error('Error fetching fresh user data:', error);
      res.locals.user = req.user; // Fallback to session user
    }
  }
  next();
};
