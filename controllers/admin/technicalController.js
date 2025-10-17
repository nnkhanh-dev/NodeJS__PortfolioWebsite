const Technical = require('../../models/Technical');
const TechType = require('../../models/TechType');

class TechController {

    async index(req, res) {
        try {
            const technicals = await Technical.find()
                .populate('typeId', 'name')
                .populate('userId', 'username')
                .lean();
            res.render('admin/Technical/index', {
                layout: 'admin',
                title: 'Công Nghệ',
                // user từ res.locals
                technicals,
            });
        } catch (error) {
            console.error('Error fetching technicals:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async create(req, res) {
        try {
            const techTypes = await TechType.find().lean();
            res.render('admin/Technical/create', {
                layout: 'admin',
                title: 'Thêm Công Nghệ',
                // user từ res.locals
                techTypes,
            });
        } catch (error) {
            console.error('Error fetching tech types:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async store(req, res) {
        try {
            const { name, typeId } = req.body;
            if (!name || !typeId) {
                const techTypes = await TechType.find().lean();
                return res.status(400).render('admin/Technical/create', {
                    layout: 'admin',
                    title: 'Thêm Công Nghệ',
                    // user từ res.locals
                    techTypes,
                    error: 'Tên công nghệ và loại công nghệ không được để trống.',
                });
            }

            const newTechnical = new Technical({
                name,
                typeId,
                userId: req.user._id,
            });
            await newTechnical.save();

            res.redirect('/admin/technicals');
        } catch (error) {
            console.error('Error creating technical:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const technical = await Technical.findById(id).lean();
            if (!technical) {
                return res.status(404).send('Công nghệ không tồn tại.');
            }
            const techTypes = await TechType.find().lean();
            res.render('admin/Technical/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa Công Nghệ',
                // user từ res.locals
                technical,
                techTypes,
            });
        } catch (error) {
            console.error('Error fetching technical for edit:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, typeId } = req.body;
            if (!name || !typeId) {
                const technical = await Technical.findById(id).lean();
                const techTypes = await TechType.find().lean();
                return res.status(400).render('admin/Technical/edit', {
                    layout: 'admin',
                    title: 'Chỉnh sửa Công Nghệ',
                    // user từ res.locals
                    technical,
                    techTypes,
                    error: 'Tên công nghệ và loại công nghệ không được để trống.',
                });
            }

            await Technical.findByIdAndUpdate(id, { name, typeId });
            res.redirect('/admin/technicals');
        } catch (error) {
            console.error('Error updating technical:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await Technical.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Công nghệ đã được xóa thành công.' });
        } catch (error) {
            console.error('Error deleting technical:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa công nghệ.' });
        }
    }
}

module.exports = new TechController();
