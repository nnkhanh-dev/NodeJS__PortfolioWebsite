const Post = require('../models/Post');
const CategoryPost = require('../models/CategoryPost');
const User = require('../models/User');
const Social = require('../models/Social');

class PostController {
  // [GET] /blog - Danh sách blog với filter, search, pagination
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 9; // 9 posts per page (3x3 grid)
      const skip = (page - 1) * limit;
      
      const search = req.query.search || '';
      const categorySlug = req.query.category || '';

      // Build query
      const query = { status: 'published' };

      // Search by title or content
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by category
      if (categorySlug) {
        const category = await CategoryPost.findOne({ slug: categorySlug });
        if (category) {
          query.category = category._id;
        }
      }

      // Get posts with pagination
      const [posts, totalPosts, categories, user, socials] = await Promise.all([
        Post.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('category', 'name slug')
          .populate('author', 'name')
          .lean(),
        Post.countDocuments(query),
        CategoryPost.find().lean(), // All categories for filter
        User.findOne().lean(), // For footer
        Social.find().lean() // For footer
      ]);

      const totalPages = Math.ceil(totalPosts / limit);

      // Build pagination info
      const pagination = {
        page,
        limit,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        pages: [],
        startItem: (page - 1) * limit + 1,
        endItem: Math.min(page * limit, totalPosts),
        showPagination: totalPages > 1
      };

      // Generate page numbers (show max 5 pages)
      const startPage = Math.max(1, page - 2);
      const endPage = Math.min(totalPages, page + 2);
      
      for (let i = startPage; i <= endPage; i++) {
        pagination.pages.push({
          number: i,
          isCurrent: i === page
        });
      }

      res.render('blog/index', {
        title: 'Blog - Chia sẻ kiến thức',
        posts,
        categories,
        selectedCategory: categorySlug,
        search,
        pagination,
        user,
        socials
      });
    } catch (err) {
      console.error('Error loading blog list:', err);
      res.status(500).send('Lỗi khi tải danh sách blog');
    }
  }

  // [GET] /blog/category/:slug - Danh sách blog theo category
  async category(req, res) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = 9;
      const skip = (page - 1) * limit;

      // Find category
      const category = await CategoryPost.findOne({ slug });
      if (!category) {
        return res.status(404).render('404', {
          title: 'Không tìm thấy danh mục'
        });
      }

      // Get posts in this category
      const [posts, totalPosts, allCategories, user, socials] = await Promise.all([
        Post.find({ category: category._id, status: 'published' })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('category', 'name slug')
          .populate('author', 'name')
          .lean(),
        Post.countDocuments({ category: category._id, status: 'published' }),
        CategoryPost.find().lean(),
        User.findOne().lean(),
        Social.find().lean()
      ]);

      const totalPages = Math.ceil(totalPosts / limit);

      const pagination = {
        page,
        limit,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        pages: [],
        startItem: (page - 1) * limit + 1,
        endItem: Math.min(page * limit, totalPosts),
        showPagination: totalPages > 1
      };

      const startPage = Math.max(1, page - 2);
      const endPage = Math.min(totalPages, page + 2);
      
      for (let i = startPage; i <= endPage; i++) {
        pagination.pages.push({
          number: i,
          isCurrent: i === page
        });
      }

      res.render('blog/index', {
        title: `${category.name} - Blog`,
        posts,
        categories: allCategories,
        selectedCategory: slug,
        search: '',
        pagination,
        user,
        socials,
        currentCategory: category
      });
    } catch (err) {
      console.error('Error loading category posts:', err);
      res.status(500).send('Lỗi khi tải bài viết theo danh mục');
    }
  }

  // [GET] /blog/:slug - Chi tiết blog
  async detail(req, res) {
    try {
      const { slug } = req.params;

      // Lấy user info cho footer
      const user = await User.findOne().lean();
      
      if (!user) {
        return res.status(404).send('Không tìm thấy thông tin user');
      }

      // Lấy bài viết theo slug
      const post = await Post.findOne({ slug, status: 'published' })
        .populate('category', 'name slug')
        .populate('author', 'name email')
        .lean();

      if (!post) {
        return res.status(404).render('404', {
          title: 'Không tìm thấy bài viết'
        });
      }

      // Lấy socials cho footer
      const socials = await Social.find({ userId: user._id }).lean();

      // Lấy 3 bài viết liên quan (cùng category, khác bài hiện tại)
      const relatedPosts = await Post.find({
        _id: { $ne: post._id },
        category: post.category._id,
        status: 'published'
      })
        .limit(3)
        .sort({ createdAt: -1 })
        .populate('category', 'name slug')
        .lean();

      res.render('blog-detail', {
        title: post.title,
        post,
        relatedPosts,
        user,
        socials
      });
    } catch (err) {
      console.error('Error loading blog detail:', err);
      res.status(500).send('Lỗi khi tải bài viết');
    }
  }
}

module.exports = new PostController();
