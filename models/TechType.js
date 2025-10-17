const mongoose = require('mongoose');

const techTypeSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TechType', techTypeSchema);
