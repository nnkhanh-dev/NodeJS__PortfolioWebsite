const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthController {

  // [GET] /auth/login
  async login(req, res) {
    res.render('auth/login', { error: null });
  }

  // [POST] /auth/login
  async loginPost(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render('auth/login', { error: info.message });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        // Nếu là admin -> vào dashboard riêng
        if (user.isAdmin) {
          return res.redirect('/admin/dashboard');
        }
        // Nếu là user thường -> vào profile
        return res.redirect('/customer/dashboard');
      });
    })(req, res, next);
  }

  // [GET] /auth/logout
  async logout(req, res, next) {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/auth/login');
    });
  }
}

module.exports = new AuthController();
