const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, index: true },
    content: { type: String, required: true }, // lưu nội dung HTML từ CKEditor (sanitized)
    thumbnail: { type: String, default: '/images/default-thumb.jpg' },
    status: { type: String, enum: ['draft', 'published', 'hidden'], default: 'draft' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryPost', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Text index for search functionality
postSchema.index({ title: 'text', content: 'text' });

// Auto-generate slug from title if not provided using slugify
postSchema.pre('validate', function(next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title, {
            lower: true,      // Convert to lowercase
            strict: true,     // Remove special characters
            locale: 'vi',     // Vietnamese locale support
            trim: true        // Trim leading/trailing replacement chars
        });
    }
    next();
});

// Virtual field: excerpt (strip HTML tags for preview)
postSchema.virtual('excerpt').get(function() {
    if (!this.content) return '';
    const textOnly = this.content.replace(/<[^>]+>/g, '');
    return textOnly.length > 200 ? textOnly.slice(0, 197) + '...' : textOnly;
});

// NOTE: Content is sanitized in controller using sanitize-html package

module.exports = mongoose.model('Post', postSchema);