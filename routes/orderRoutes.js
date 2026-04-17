const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getOrders,
  getOrdersByTable,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  generateBill
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');


// ================= PROTECTED ROUTES (Admin only) ================= //

// Order stats (admin)
router.get('/stats', protect, getOrderStats);

// Get all orders (admin dashboard)
router.get('/', protect, getOrders);

// Update order status (kitchen/admin)
router.put('/:id/status', protect, updateOrderStatus);


// ================= PUBLIC ROUTES (Customer) ================= //

// Place new order
router.post('/', placeOrder);

// Get orders by table (for customer history)
router.get('/table/:tableId', getOrdersByTable);

// Generate bill
router.get('/:id/bill', generateBill);

// Update payment status (used after Razorpay verify)
router.put('/:id/payment', updatePaymentStatus);

// Get single order (for tracking page) - Generic ID route should be last
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;