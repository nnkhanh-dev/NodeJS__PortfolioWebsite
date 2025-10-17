const Education = require('../../models/Education');

class EducationController {

    async index(req, res) {
        try {
            const educations = await Education.find()
                .populate('userId', 'username')
                .lean();
            res.render('admin/Education/index', {
                layout: 'admin',
                title: 'Học Vấn',
                // user từ res.locals
                educations,
            });
        } catch (error) {
            console.error('Error fetching educations:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async create(req, res) {
        res.render('admin/Education/create', {
            layout: 'admin',
            title: 'Thêm Học Vấn',
            // user từ res.locals
        });
    }

    async store(req, res) {
        try {
            const { name, from, to, major, level, gpa, achievements } = req.body;
            if (!name || !from || !to || !major || !level) {
                return res.status(400).render('admin/Education/create', {
                    layout: 'admin',
                    title: 'Thêm Học Vấn',
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
                });
            }

            const newEducation = new Education({
                name,
                from,
                to,
                major,
                level,
                gpa: gpa ? parseFloat(gpa) : null,
                achievements: achievements ? achievements.trim() : '',
                userId: req.user._id,
            });
            await newEducation.save();

            res.redirect('/admin/educations');
        } catch (error) {
            console.error('Error creating education:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const education = await Education.findById(id).lean();
            if (!education) {
                return res.status(404).send('Học vấn không tồn tại.');
            }

            res.render('admin/Education/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa Học Vấn',
                // user từ res.locals
                education,
            });
        } catch (error) {
            console.error('Error fetching education for edit:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, from, to, major, level, gpa, achievements } = req.body;
            
            if (!name || !from || !to || !major || !level) {
                const education = await Education.findById(id).lean();
                return res.status(400).render('admin/Education/edit', {
                    layout: 'admin',
                    title: 'Chỉnh sửa Học Vấn',
                    education,
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
                });
            }

            const education = await Education.findById(id);
            if (!education) {
                return res.status(404).send('Học vấn không tồn tại.');
            }

            education.name = name;
            education.from = from;
            education.to = to;
            education.major = major;
            education.level = level;
            education.gpa = gpa ? parseFloat(gpa) : null;
            education.achievements = achievements ? achievements.trim() : '';
            
            await education.save();
            
            res.redirect('/admin/educations');
        } catch (error) {
            console.error('Error updating education:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await Education.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Học vấn đã được xóa thành công.' });
        } catch (error) {
            console.error('Error deleting education:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa học vấn.' });
        }
    }
}

module.exports = new EducationController();
