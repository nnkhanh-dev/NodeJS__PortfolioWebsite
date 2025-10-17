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

      const [projects, socials, experiences, educations, technicals, techTypes] = await Promise.all([
        Project.find({ userId: user._id }).populate('technologies', 'name').lean(),
        Social.find({ userId: user._id }).lean(),
        Experience.find({ userId: user._id }).sort({ from: -1 }).lean(),
        Education.find({ userId: user._id }).sort({ from: -1 }).lean(),
        Technical.find({ userId: user._id }).populate('typeId').lean(),
        TechType.find().lean()
      ]);

      // Group technicals by type
      const techByType = {};
      technicals.forEach(tech => {
        if (tech.typeId) {
          const typeName = tech.typeId.name;
          if (!techByType[typeName]) {
            techByType[typeName] = {
              icon: tech.typeId.icon, // Lấy icon từ TechType
              skills: []
            };
          }
          techByType[typeName].skills.push(tech);
        }
      });

      // Convert object to array for Handlebars
      const techByTypeArray = Object.keys(techByType).map(key => ({
        typeName: key,
        icon: techByType[key].icon,
        skills: techByType[key].skills
      }));

      res.render('home', {
        user,
        projects,
        socials,
        experiences,
        educations,
        technicals,
        techByTypeArray
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi khi tải dữ liệu người dùng');
    }
  }
}

module.exports = new HomeController();
