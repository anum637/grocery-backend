const mongoose = require('mongoose');
const SubscriptionSchema = new mongoose.Schema({
  userId: { type: String, default: "user1" },
  items: [{ name: String, productId: String, qty: Number, price: Number }],
  frequency: String,
  slot: { type: String, default: "06:00 - 08:00" },
  paymentMethod: String,
  payment: String,
  customDays: [String],
  status: { type: String, default: "active" },
  total: Number,
  nextDelivery: String,
  createdAt: { type: Date, default: Date.now },
  area: { type: String, default: "" },
  address: { type: String, default: "" },
  substitutePreference: { type: String, default: "Allow Substitute" },
  skipped: { type: Boolean, default: false },
  phone: { type: String, default: "" }
});
module.exports = mongoose.model('Subscription', SubscriptionSchema);