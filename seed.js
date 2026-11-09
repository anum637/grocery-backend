const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const products = [
  { name: 'Fresh Cow Milk', price: 55, mrp: 60, category: 'Dairy', stock: 50, unit: 'litre', emoji: '🥛', image: '' },
  { name: 'Brown Eggs', price: 78, mrp: 90, category: 'Dairy', stock: 100, unit: 'tray', emoji: '🥚', image: '' },
  { name: 'Paneer', price: 90, mrp: 100, category: 'Dairy', stock: 30, unit: 'pack', emoji: '🧀', image: '' },
  { name: 'Amul Butter', price: 58, mrp: 65, category: 'Dairy', stock: 35, unit: 'pack', emoji: '🧈', image: '' },
  { name: 'Berries', price: 180, mrp: 200, category: 'Fruits', stock: 45, unit: 'kg', emoji: '🫐', image: '' },
  { name: 'Tomato', price: 25, mrp: 35, category: 'Vegetables', stock: 60, unit: 'kg', emoji: '🍅', image: '' },
  { name: 'Onion', price: 30, mrp: 38, category: 'Vegetables', stock: 80, unit: 'kg', emoji: '🧅', image: '' },
  { name: 'Potato', price: 28, mrp: 35, category: 'Vegetables', stock: 90, unit: 'kg', emoji: '🥔', image: '' },
  { name: 'Red Chilli', price: 20, mrp: 25, category: 'Vegetables', stock: 40, unit: 'kg', emoji: '🌶', image: '' },
  { name: 'Rajma', price: 175, mrp: 200, category: 'Grocery', stock: 25, unit: 'kg', emoji: '🫘', image: '' },
  { name: 'Apple', price: 185, mrp: 190, category: 'Grocery', stock: 20, unit: 'kg', emoji: '🍎', image: '' },
  { name: 'Bread', price: 45, mrp: 50, category: 'Grocery', stock: 50, unit: 'kg', emoji: '🍞', image: '' },
  { name: 'Salt', price: 22, mrp: 25, category: 'Grocery', stock: 100, unit: 'kg', emoji: '🧂', image: '' },
  { name: 'Carrot', price: 90, mrp: 100, category: 'Vegetables', stock: 30, unit: 'pack', emoji: '🥕', image: '' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Data seeded with emojis!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seed();