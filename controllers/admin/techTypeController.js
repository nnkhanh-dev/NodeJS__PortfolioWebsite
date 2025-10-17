const TechType = require('../../models/TechType');

class TechTypeController {

    async index(req, res) {
        try {
            const techTypes = await TechType.find().lean();
            res.render('admin/TechType/index', {
                layout: 'admin',
                title: 'Loại Công Nghệ',
                // user từ res.locals
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
            // user từ res.locals
        });
    }

    async store(req, res) {
        try {
            let { name, icon } = req.body;
            
            // Trim whitespace
            name = name ? name.trim() : '';
            icon = icon ? icon.trim() : '';
            
            // Validation
            if (!name || !icon) {
                return res.status(400).render('admin/TechType/create', {
                    layout: 'admin',
                    title: 'Thêm Loại Công Nghệ',
                    error: 'Tên và icon loại công nghệ không được để trống.',
                });
            }

            const newTechType = new TechType({ name, icon });
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
                // user từ res.locals
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
            let { name, icon } = req.body;
            
            // Trim whitespace
            name = name ? name.trim() : '';
            icon = icon ? icon.trim() : '';
            
            // Validation
            if (!name || !icon) {
                const techType = await TechType.findById(id).lean();
                return res.status(400).render('admin/TechType/edit', {
                    layout: 'admin',
                    title: 'Chỉnh sửa Loại Công Nghệ',
                    techType,
                    error: 'Tên và icon loại công nghệ không được để trống.',
                });
            }

            // Update using .save() method (more reliable than findByIdAndUpdate)
            const techType = await TechType.findById(id);
            if (!techType) {
                return res.status(404).send('Loại công nghệ không tồn tại.');
            }
            
            techType.name = name;
            techType.icon = icon;
            await techType.save();
            
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