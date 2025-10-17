const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  name: { type: String },
  from: { type: String },
  to: { type: String },
  major: { type: String },
  level: { type: String },
  gpa: { type: Number },
  achievements: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
