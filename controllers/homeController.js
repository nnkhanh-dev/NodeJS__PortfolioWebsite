const User = require('../models/User');

class HomeController {
  // [GET] /
  async index(req, res) {
    try {
      // Lấy user đầu tiên
      const user = await User.findOne()
        .lean(); // chỉ cần thông tin cơ bản user

      if (!user) return res.status(404).send('Không tìm thấy user');

      // Lấy các bảng phụ liên quan
      const Project = require('../models/Project');
      const Social = require('../models/Social');
      const Experience = require('../models/Experience');
      const Education = require('../models/Education');
      const Technical = require('../models/Technical');
      const TechType = require('../models/TechType');

      const [projects, socials, experiences, educations, technicals] = await Promise.all([
        Project.find({ userId: user._id }).lean(),
        Social.find({ userId: user._id }).lean(),
        Experience.find({ userId: user._id }).lean(),
        Education.find({ userId: user._id }).lean(),
        Technical.find({ userId: user._id }).populate('typeId').lean()
      ]);

      res.render('home', {
        user,
        projects,
        socials,
        experiences,
        educations,
        technicals
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi khi tải dữ liệu người dùng');
    }
  }
}

module.exports = new HomeController();
