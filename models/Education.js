const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  name: { type: String },
  from: { type: Date },
  to: { type: Date },
  major: { type: String },
  level: { type: String },
  gpa: { type: Number },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
