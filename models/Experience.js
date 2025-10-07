const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  name: { type: String },
  from: { type: Date },
  to: { type: Date },
  position: { type: String },
  description: { type: String },
  features: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);