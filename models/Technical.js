const mongoose = require('mongoose');

const technicalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechType',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Technical', technicalSchema);
