const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: {type: Number, default:0},
  category: { type: String, default: 'Fresh' },
  stock: { type: Number, default: 50 },
  image: { type: String, default: '' },
  emoji: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);