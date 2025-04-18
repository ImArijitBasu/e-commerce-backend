import express from 'express';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { authMiddleware } from '../middleware/auth.js'; // your auth guard

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { shipping, payment } = req.body;

    // Fetch the current cart
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.products.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items
    const items = cart.products.map(p => ({
      product: p._id,
      quantity: p.quantity,
      price: p.price,
    }));

    // Compute total
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      // optionally apply shipping/payment fields

    // Create order
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: Date.now(),
      // you can embed shipping & payment details in schema if desired
    });
    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ userId });

    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// (Optional) Get single order by ID
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id })
      .populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
