const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  icon: { type: String },
  name: { type: String },
  url: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Social', socialSchema);