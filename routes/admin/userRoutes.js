const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const userController = require('../../controllers/admin/userController');
const uploadUser = require('../../config/multerUser');
const User = require('../../models/User');

router.get('/edit', isAdmin, userController.edit);

// POST with error handling for multer
router.post('/edit', isAdmin, async (req, res, next) => {
    uploadUser.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ])(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            
            // Lấy dữ liệu từ database
            const profile = await User.findById(req.user._id).lean();
            
            // Merge với dữ liệu từ form để giữ lại những gì user đã nhập
            profile.name = req.body.name || profile.name;
            profile.email = req.body.email || profile.email;
            profile.position = req.body.position || profile.position;
            profile.description = req.body.description || profile.description;
            
            return res.status(400).render('admin/User/edit', {
                layout: 'admin',
                title: 'Cập nhật Thông tin',
                user: profile,
                profile,
                error: err.message || 'Lỗi khi upload file. Vui lòng kiểm tra định dạng và kích thước file.',
            });
        }
        next();
    });
}, userController.update);

module.exports = router;
