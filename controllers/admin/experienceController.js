const Experience = require('../../models/Experience');

class ExperienceController {

    async index(req, res) {
        try {
            const experiences = await Experience.find()
                .populate('userId', 'username')
                .lean();
            res.render('admin/Experience/index', {
                layout: 'admin',
                title: 'Kinh Nghiệm Làm Việc',
                // user từ res.locals
                experiences,
            });
        } catch (error) {
            console.error('Error fetching experiences:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async create(req, res) {
        res.render('admin/Experience/create', {
            layout: 'admin',
            title: 'Thêm Kinh Nghiệm Làm Việc',
            // user từ res.locals
        });
    }

    async store(req, res) {
        try {
            const { name, from, to, position, description, features } = req.body;
            if (!name || !from || !to || !position) {
                return res.status(400).render('admin/Experience/create', {
                    layout: 'admin',
                    title: 'Thêm Kinh Nghiệm Làm Việc',
                    // user từ res.locals
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
                });
            }

            const newExperience = new Experience({
                name,
                from,
                to,
                position,
                description,
                features,
                userId: req.user._id,
            });
            await newExperience.save();

            res.redirect('/admin/experiences');
        } catch (error) {
            console.error('Error creating experience:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const experience = await Experience.findById(id)
                .populate('userId', 'name email')
                .lean();
            if (!experience) {
                return res.status(404).send('Kinh nghiệm không tồn tại.');
            }
            res.render('admin/Experience/show', {
                layout: 'admin',
                title: 'Chi Tiết Kinh Nghiệm Làm Việc',
                // user từ res.locals
                experience,
            });
        } catch (error) {
            console.error('Error fetching experience details:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const experience = await Experience.findById(id).lean();
            if (!experience) {
                return res.status(404).send('Kinh nghiệm không tồn tại.');
            }
            res.render('admin/Experience/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa Kinh Nghiệm Làm Việc',
                // user từ res.locals
                experience,
            });
        } catch (error) {
            console.error('Error fetching experience for edit:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, from, to, position, description, features } = req.body;
            if (!name || !from || !to || !position) {
                const experience = await Experience.findById(id).lean();
                return res.status(400).render('admin/Experience/edit', {
                    layout: 'admin',
                    title: 'Chỉnh sửa Kinh Nghiệm Làm Việc',
                    // user từ res.locals
                    experience,
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
                });
            }

            await Experience.findByIdAndUpdate(id, {
                name,
                from,
                to,
                position,
                description,
                features,
            });
            res.redirect('/admin/experiences');
        } catch (error) {
            console.error('Error updating experience:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await Experience.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Kinh nghiệm đã được xóa thành công.' });
        } catch (error) {
            console.error('Error deleting experience:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa kinh nghiệm.' });
        }
    }
}

module.exports = new ExperienceController();
