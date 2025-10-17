const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Technical = require('../models/Technical');
const Social = require('../models/Social');

class dashController {
    // [GET] /dashboard
    async index(req, res) {
        try {
            console.log('=== LOADING DASHBOARD ===');
            
            // Đếm tổng số
            const totalProjects = await Project.countDocuments();
            const totalExperiences = await Experience.countDocuments();
            const totalTechnicals = await Technical.countDocuments();
            const totalSocials = await Social.countDocuments();


            // Lấy 5 dự án mới nhất
            const recentProjects = await Project.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            console.log('Recent projects count:', recentProjects.length);

            res.render('admin/dashboard', {
                layout: 'admin',
                title: 'Admin Dashboard',
                stats: {
                    totalProjects,
                    totalExperiences,
                    totalTechnicals,
                    totalSocials
                },
                recentProjects
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new dashController();