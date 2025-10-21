const CategoryPost = require('../../models/CategoryPost');

const categoryPostController = {
    // [GET] /admin/category-posts
    async index(req, res) {
        try {
            const categories = await CategoryPost.find().sort({ createdAt: -1 });
            res.render('admin/CategoryPost/index', {
                title: 'Quản lý Danh mục Bài viết',
                categories,
                layout: 'admin'
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            req.flash('error', 'Không thể tải danh sách danh mục');
            res.redirect('/admin/dashboard');
        }
    },

    // [GET] /admin/category-posts/create
    async create(req, res) {
        res.render('admin/CategoryPost/create', {
            title: 'Thêm Danh mục mới',
            layout: 'admin'
        });
    },

    // [POST] /admin/category-posts/create
    async store(req, res) {
        try {
            const { name, description, slug } = req.body;

            // Validate
            if (!name || name.trim() === '') {
                req.flash('error', 'Tên danh mục không được để trống');
                return res.redirect('/admin/category-posts/create');
            }

            // Create category
            const category = new CategoryPost({
                name: name.trim(),
                description: description ? description.trim() : '',
                slug: slug ? slug.trim() : undefined // Let pre-validate hook generate if empty
            });

            await category.save();

            req.flash('success', 'Thêm danh mục thành công');
            res.redirect('/admin/category-posts');
        } catch (error) {
            console.error('Error creating category:', error);
            if (error.code === 11000) {
                req.flash('error', 'Tên hoặc slug danh mục đã tồn tại');
            } else {
                req.flash('error', 'Có lỗi xảy ra khi thêm danh mục');
            }
            res.redirect('/admin/category-posts/create');
        }
    },

    // [GET] /admin/category-posts/edit/:id
    async edit(req, res) {
        try {
            const category = await CategoryPost.findById(req.params.id);
            if (!category) {
                req.flash('error', 'Không tìm thấy danh mục');
                return res.redirect('/admin/category-posts');
            }

            res.render('admin/CategoryPost/edit', {
                title: 'Sửa Danh mục',
                category,
                layout: 'admin'
            });
        } catch (error) {
            console.error('Error fetching category:', error);
            req.flash('error', 'Không thể tải thông tin danh mục');
            res.redirect('/admin/category-posts');
        }
    },

    // [POST] /admin/category-posts/edit/:id
    async update(req, res) {
        try {
            const { name, description, slug } = req.body;

            // Validate
            if (!name || name.trim() === '') {
                req.flash('error', 'Tên danh mục không được để trống');
                return res.redirect(`/admin/category-posts/edit/${req.params.id}`);
            }

            const category = await CategoryPost.findById(req.params.id);
            if (!category) {
                req.flash('error', 'Không tìm thấy danh mục');
                return res.redirect('/admin/category-posts');
            }

            // Update fields
            category.name = name.trim();
            category.description = description ? description.trim() : '';
            if (slug && slug.trim() !== '') {
                category.slug = slug.trim();
            }

            await category.save();

            req.flash('success', 'Cập nhật danh mục thành công');
            res.redirect('/admin/category-posts');
        } catch (error) {
            console.error('Error updating category:', error);
            if (error.code === 11000) {
                req.flash('error', 'Tên hoặc slug danh mục đã tồn tại');
            } else {
                req.flash('error', 'Có lỗi xảy ra khi cập nhật danh mục');
            }
            res.redirect(`/admin/category-posts/edit/${req.params.id}`);
        }
    },

    // [POST] /admin/category-posts/delete/:id
    async destroy(req, res) {
        try {
            const Post = require('../../models/Post');
            
            // Check if category has posts
            const postCount = await Post.countDocuments({ category: req.params.id });
            if (postCount > 0) {
                req.flash('error', `Không thể xóa danh mục này vì có ${postCount} bài viết đang sử dụng`);
                return res.redirect('/admin/category-posts');
            }

            await CategoryPost.findByIdAndDelete(req.params.id);
            req.flash('success', 'Xóa danh mục thành công');
            res.redirect('/admin/category-posts');
        } catch (error) {
            console.error('Error deleting category:', error);
            req.flash('error', 'Có lỗi xảy ra khi xóa danh mục');
            res.redirect('/admin/category-posts');
        }
    }
};

module.exports = categoryPostController;
