const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');

// CREATE ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.totalAmount || isNaN(order.totalAmount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    const options = {
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: orderId.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Store latest order id (overwrite allowed)
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
    });

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};


// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    order.paymentStatus = "Paid";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorPaySignature = razorpay_signature;

    await order.save();

    // socket emit
    const io = req.app.get('socketio');
    io.emit('paymentSuccess', { orderId });

    res.json({ success: true });

  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: err.message });
  }
};