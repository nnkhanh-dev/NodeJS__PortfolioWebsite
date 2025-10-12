const TechType = require('../../models/TechType');

class TechTypeController {

    async index(req, res) {
        try {
            const techTypes = await TechType.find().lean();
            res.render('admin/TechType/index', {
                layout: 'admin',
                title: 'Loại Công Nghệ',
                user: req.user,
                techTypes,
            });
        } catch (error) {
            console.error('Error fetching tech types:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async create(req, res) {
        res.render('admin/TechType/create', {
            layout: 'admin',
            title: 'Thêm Loại Công Nghệ',
            user: req.user,
        });
    }

    async store(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).render('admin/TechType/create', {
                    layout: 'admin',
                    title: 'Thêm Loại Công Nghệ',
                    user: req.user,
                    error: 'Tên loại công nghệ không được để trống.',
                });
            }

            const newTechType = new TechType({ name });
            await newTechType.save();

            res.redirect('/admin/tech-types');
        } catch (error) {
            console.error('Error creating tech type:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const techType = await TechType.findById(id).lean();
            if (!techType) {
                return res.status(404).send('Loại công nghệ không tồn tại.');
            }
            res.render('admin/TechType/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa Loại Công Nghệ',
                user: req.user,
                techType,
            });
        } catch (error) {
            console.error('Error fetching tech type for edit:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            if (!name) {
                const techType = await TechType.findById(id).lean();
                return res.status(400).render('admin/TechType/edit', {
                    layout: 'admin',
                    title: 'Chỉnh sửa Loại Công Nghệ',
                    user: req.user,
                    techType,
                    error: 'Tên loại công nghệ không được để trống.',
                });
            }

            await TechType.findByIdAndUpdate(id, { name });
            res.redirect('/admin/tech-types');
        } catch (error) {
            console.error('Error updating tech type:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await TechType.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Loại công nghệ đã được xóa thành công.' });
        } catch (error) {
            console.error('Error deleting tech type:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa loại công nghệ.' });
        }
    }
}

module.exports = new TechTypeController();