const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    productId: String,
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    sold: Boolean
});

module.exports = mongoose.model('Transaction', TransactionSchema);
