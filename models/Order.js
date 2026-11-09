const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  subscriptionId: String, userId: String,
  items: [{name:String, qty:Number}],
  deliveryDate: String, slot: String,
  total: Number, status: {type:String, default:"scheduled"},
  paymentStatus: {type:String, default:"pending"}
}, {timestamps:true});
module.exports = mongoose.model('Order', OrderSchema);