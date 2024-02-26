const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  contact: Number,
  totalItems: Number,
  totalPrice: Number,
  date: String,
  items: [String], // Assuming items are stored as an array of strings
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

