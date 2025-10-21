const mongoose = require('mongoose');
const slugify = require('slugify');

const categoryPostSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: '' },
  slug: { type: String, unique: true, trim: true, index: true }
}, { timestamps: true });

// Auto-generate slug from name if not provided using slugify
categoryPostSchema.pre('validate', function(next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, {
            lower: true,      // Convert to lowercase
            strict: true,     // Remove special characters
            locale: 'vi',     // Vietnamese locale support
            trim: true        // Trim leading/trailing replacement chars
        });
    }
    next();
});

module.exports = mongoose.model('CategoryPost', categoryPostSchema);