const Order = require('../models/Order');
const PDFDocument = require('pdfkit');

exports.placeOrder = async (req, res) => {
    const { tableId, items, totalAmount } = req.body;
    try {
        const order = new Order({ tableId, items, totalAmount });
        const savedOrder = await order.save();

        // Emit socket event for kitchen
        const io = req.app.get('socketio');
        io.emit('newOrder', savedOrder);

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrdersByTable = async (req, res) => {
    try {
        const orders = await Order.find({ tableId: req.params.tableId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

        // Emit socket event for customer status update
        const io = req.app.get('socketio');
        io.emit('orderStatusUpdated', order);

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $match: { paymentStatus: "Paid" } // IMPORTANT: must match your DB
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalOrders,
      totalRevenue
    });

  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.generateBill = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bill-${order._id}.pdf`);

        doc.pipe(res);

        doc.fontSize(25).text('RESTAURANT RECEIPT', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Table: ${order.tableId}`);
        doc.text(`Order ID: ${order._id}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
        doc.moveDown();

        doc.text('-------------------------------------------');
        order.items.forEach(item => {
            doc.text(`${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`);
        });
        doc.text('-------------------------------------------');
        doc.fontSize(20).text(`Total: ₹${order.totalAmount}`, { align: 'right' });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updatePaymentStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus }, { new: true });

        // Emit socket event for payment status update
        const io = req.app.get('socketio');
        io.emit('orderStatusUpdated', order);

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
