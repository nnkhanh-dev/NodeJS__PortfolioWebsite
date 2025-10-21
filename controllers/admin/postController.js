const Post = require('../../models/Post');
const CategoryPost = require('../../models/CategoryPost');
const multer = require('multer');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

// Configure multer for thumbnail upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/posts/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB for files
        fieldSize: 10 * 1024 * 1024 // 10MB for text fields (content)
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
        }
    }
});

const postController = {
    // [GET] /admin/posts
    async index(req, res) {
        try {
            const posts = await Post.find()
                .populate('category', 'name')
                .populate('author', 'name email')
                .sort({ createdAt: -1 });
            
            res.render('admin/Post/index', {
                title: 'Quản lý Bài viết',
                posts,
                layout: 'admin'
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            req.flash('error', 'Không thể tải danh sách bài viết');
            res.redirect('/admin/dashboard');
        }
    },

    // [GET] /admin/posts/create
    async create(req, res) {
        try {
            const categories = await CategoryPost.find().sort({ name: 1 });
            res.render('admin/Post/create', {
                title: 'Thêm Bài viết mới',
                categories,
                layout: 'admin'
            });
        } catch (error) {
            console.error('Error loading create form:', error);
            req.flash('error', 'Không thể tải form tạo bài viết');
            res.redirect('/admin/posts');
        }
    },

    // [POST] /admin/posts/create
    async store(req, res) {
        try {
            const { title, content, status, category, slug } = req.body;

            // Validate
            if (!title || title.trim() === '') {
                req.flash('error', 'Tiêu đề không được để trống');
                return res.redirect('/admin/posts/create');
            }
            if (!content || content.trim() === '') {
                req.flash('error', 'Nội dung không được để trống');
                return res.redirect('/admin/posts/create');
            }
            if (!category) {
                req.flash('error', 'Vui lòng chọn danh mục');
                return res.redirect('/admin/posts/create');
            }

            // Sanitize HTML content
            const cleanContent = sanitizeHtml(content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'iframe']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ['src', 'alt', 'title', 'width', 'height'],
                    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
                    a: ['href', 'name', 'target'],
                    '*': ['class', 'id', 'style']
                },
                allowedSchemes: ['http', 'https', 'mailto', 'tel'],
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
            });

            // Create post
            const post = new Post({
                title: title.trim(),
                content: cleanContent,
                status: status || 'draft',
                category: category,
                author: req.user._id,
                slug: slug ? slug.trim() : undefined,
                thumbnail: req.file ? `/uploads/posts/${req.file.filename}` : undefined
            });

            await post.save();

            req.flash('success', 'Thêm bài viết thành công');
            res.redirect('/admin/posts');
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.code === 11000) {
                req.flash('error', 'Slug bài viết đã tồn tại');
            } else {
                req.flash('error', 'Có lỗi xảy ra khi thêm bài viết');
            }
            res.redirect('/admin/posts/create');
        }
    },

    // [GET] /admin/posts/edit/:id
    async edit(req, res) {
        try {
            const [post, categories] = await Promise.all([
                Post.findById(req.params.id)
                    .populate('category', 'name')
                    .populate('author', 'name email'),
                CategoryPost.find().sort({ name: 1 })
            ]);

            if (!post) {
                req.flash('error', 'Không tìm thấy bài viết');
                return res.redirect('/admin/posts');
            }

            res.render('admin/Post/edit', {
                title: 'Sửa Bài viết',
                post,
                categories,
                layout: 'admin'
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            req.flash('error', 'Không thể tải thông tin bài viết');
            res.redirect('/admin/posts');
        }
    },

    // [POST] /admin/posts/edit/:id
    async update(req, res) {
        try {
            const { title, content, status, category, slug } = req.body;

            // Validate
            if (!title || title.trim() === '') {
                req.flash('error', 'Tiêu đề không được để trống');
                return res.redirect(`/admin/posts/edit/${req.params.id}`);
            }
            if (!content || content.trim() === '') {
                req.flash('error', 'Nội dung không được để trống');
                return res.redirect(`/admin/posts/edit/${req.params.id}`);
            }
            if (!category) {
                req.flash('error', 'Vui lòng chọn danh mục');
                return res.redirect(`/admin/posts/edit/${req.params.id}`);
            }

            const post = await Post.findById(req.params.id);
            if (!post) {
                req.flash('error', 'Không tìm thấy bài viết');
                return res.redirect('/admin/posts');
            }

            // Sanitize HTML content
            const cleanContent = sanitizeHtml(content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'iframe']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ['src', 'alt', 'title', 'width', 'height'],
                    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
                    a: ['href', 'name', 'target'],
                    '*': ['class', 'id', 'style']
                },
                allowedSchemes: ['http', 'https', 'mailto', 'tel'],
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
            });

            // Update fields
            post.title = title.trim();
            post.content = cleanContent;
            post.status = status || 'draft';
            post.category = category;
            
            if (slug && slug.trim() !== '') {
                post.slug = slug.trim();
            }

            if (req.file) {
                post.thumbnail = `/uploads/posts/${req.file.filename}`;
            }

            await post.save();

            req.flash('success', 'Cập nhật bài viết thành công');
            res.redirect('/admin/posts');
        } catch (error) {
            console.error('Error updating post:', error);
            if (error.code === 11000) {
                req.flash('error', 'Slug bài viết đã tồn tại');
            } else {
                req.flash('error', 'Có lỗi xảy ra khi cập nhật bài viết');
            }
            res.redirect(`/admin/posts/edit/${req.params.id}`);
        }
    },

    // [POST] /admin/posts/delete/:id
    async destroy(req, res) {
        try {
            await Post.findByIdAndDelete(req.params.id);
            req.flash('success', 'Xóa bài viết thành công');
            res.redirect('/admin/posts');
        } catch (error) {
            console.error('Error deleting post:', error);
            req.flash('error', 'Có lỗi xảy ra khi xóa bài viết');
            res.redirect('/admin/posts');
        }
    }
};

module.exports = { postController, upload };
