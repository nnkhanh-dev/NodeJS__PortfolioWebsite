const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  position: { type: String },
  description: { type: String },
  resume: { type: String }, // link CV, PDF...
  isAdmin: { type: Boolean, default: false }, // Thêm quyền admin
}, { timestamps: true });

// So sánh mật khẩu
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
