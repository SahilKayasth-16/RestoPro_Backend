const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'] },
    image: { type: String, default: 'https://via.placeholder.com/300' },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
