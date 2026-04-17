const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    tableId: { type: String, required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Preparing', 'Prepared', 'Delivered'],
        default: 'Preparing'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        default: 'online'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorPaySignature: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
