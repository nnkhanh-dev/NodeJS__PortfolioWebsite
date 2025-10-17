const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String }, // URL hình
  url: { type: String },       // Link demo/project
  technologies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technical'
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);