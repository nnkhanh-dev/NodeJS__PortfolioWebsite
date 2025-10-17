const Social = require('../../models/Social');

class SocialController {

    async index(req, res) {
        try {
            const socials = await Social.find()
                .populate('userId', 'username')
                .lean();
            res.render('admin/Social/index', {
                layout: 'admin',
                title: 'Mạng Xã Hội',
                // user từ res.locals
                socials,
            });
        } catch (error) {
            console.error('Error fetching socials:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async create(req, res) {
        res.render('admin/Social/create', {
            layout: 'admin',
            title: 'Thêm Mạng Xã Hội',
            // user từ res.locals
        });
    }

    async store(req, res) {
        try {
            const { icon, name, url } = req.body;
            if (!icon || !name || !url) {
                return res.status(400).render('admin/Social/create', {
                    layout: 'admin',
                    title: 'Thêm Mạng Xã Hội',
                    // user từ res.locals
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
                });
            }

            const newSocial = new Social({
                icon,
                name,
                url,
                userId: req.user._id,
            });
            await newSocial.save();

            res.redirect('/admin/socials');
        } catch (error) {
            console.error('Error creating social:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const social = await Social.findById(id)
                .populate('userId', 'username email')
                .lean();
            if (!social) {
                return res.status(404).send('Mạng xã hội không tồn tại.');
            }
            res.render('admin/Social/show', {
                layout: 'admin',
                title: 'Chi Tiết Mạng Xã Hội',
                // user từ res.locals
                social,
            });
        } catch (error) {
            console.error('Error fetching social details:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const social = await Social.findById(id).lean();
            if (!social) {
                return res.status(404).send('Mạng xã hội không tồn tại.');
            }
            res.render('admin/Social/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa Mạng Xã Hội',
                // user từ res.locals
                social,
            });
        } catch (error) {
            console.error('Error fetching social for edit:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { icon, name, url } = req.body;
            if (!icon || !name || !url) {
                const social = await Social.findById(id).lean();
                return res.status(400).render('admin/Social/edit', {
                    layout: 'admin',
                    title: 'Chỉnh sửa Mạng Xã Hội',
                    // user từ res.locals
                    social,
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
                });
            }

            await Social.findByIdAndUpdate(id, {
                icon,
                name,
                url,
            });
            res.redirect('/admin/socials');
        } catch (error) {
            console.error('Error updating social:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await Social.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Mạng xã hội đã được xóa thành công.' });
        } catch (error) {
            console.error('Error deleting social:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa mạng xã hội.' });
        }
    }
}

module.exports = new SocialController();
