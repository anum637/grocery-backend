require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const Subscription = require('./models/Subscription');
const Order = require('./models/Order');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(e => console.log("❌ Mongo Error:", e.message));

app.get('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    await Product.insertMany([
      { name: "Milk 1L", category: "Dairy", price: 55, mrp: 60, unit: "litre", stock: 120, img: "🥛", emoji: "🥛" },
      { name: "Brown Bread", category: "Bakery", price: 40, mrp: 45, unit: "pack", stock: 80, img: "🍞", emoji: "🍞" },
      { name: "Chocolate 100g", category: "Snacks", price: 50, mrp: 60, unit: "pack", stock: 80, img: "🍫", emoji: "🍫" },
      { name: "Tomato 1kg", category: "Vegetables", price: 28, mrp: 35, unit: "kg", stock: 12, img: "🍅", emoji: "🍅" },
      { name: "Eggs 12pcs", category: "Dairy", price: 84, mrp: 90, unit: "tray", stock: 60, img: "🥚", emoji: "🥚" },
      { name: "Atta 5kg", category: "Household", price: 240, mrp: 280, unit: "bag", stock: 30, img: "🌾", emoji: "🌾" },
    ]);
    res.json({ msg: "Seeded 6 products with Chocolate" });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const p = await Product.find();
    res.json(p);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// --- SUBSCRIPTIONS ---
app.post('/api/subscriptions', async (req, res) => {
  try {
    if (!req.body.slot || req.body.slot.includes("00:00")) {
      req.body.slot = "06:00 - 08:00";
    }
    if (!req.body.area || req.body.area === "Not Provided") {
      req.body.area = "";
    }
    if (!req.body.substitutePreference) {
      req.body.substitutePreference = "Allow Substitute";
    }

    for (let item of req.body.items) {
      const prod = await Product.findOne({ name: item.name });
      if (!prod || prod.stock < item.qty) {
        return res.status(400).json({ msg: `Out of stock: ${item.name}` });
      }
    }

    const sub = await Subscription.create(req.body);

    await Order.create({
      subscriptionId: sub._id, userId: "user1",
      items: sub.items, deliveryDate: "Tomorrow", slot: sub.slot,
      total: sub.total, status: "scheduled", paymentStatus: req.body.payment === "cod" || req.body.paymentMethod === "cod" ? "pending" : "paid"
    });

    for (let item of sub.items) {
      await Product.updateOne({ name: item.name }, { $inc: { stock: -item.qty } });
    }
    res.json(sub);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

app.get('/api/subscriptions', async (req, res) => {
  try {
    const subs = await Subscription.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

app.get('/api/subscriptions/my', async (req, res) => {
  try {
    const subs = await Subscription.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

app.patch('/api/subscriptions/:id', async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

app.put('/api/subscriptions/:id', async (req, res) => {
  try {
    if (req.body.slot && req.body.slot.includes("00:00")) {
      req.body.slot = "06:00 - 08:00";
    }
    // Fix Not Provided area
    if (req.body.area === "Not Provided") {
      req.body.area = "";
    }
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

app.put('/api/subscriptions/:id/skip', async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ msg: "Not found" });
    sub.skipped = !sub.skipped;
    await sub.save();
    res.json(sub);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Pause
app.put('/api/subscriptions/:id/pause', async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(req.params.id, { status: "paused" }, { new: true });
    res.json(updated);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// --- ADMIN ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalSubs = await Subscription.countDocuments();
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    const failedPayments = await Order.countDocuments({ paymentStatus: "failed" });
    const lowStock = await Product.find({ stock: { $lt: 20 } });
    res.json({ todayDeliveries: todayOrders, failedPayments, lowStock, totalSubs });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

app.listen(process.env.PORT || 5000, '0.0.0.0', () => console.log(`✅ Backend running on http://localhost:${process.env.PORT || 5000}`));