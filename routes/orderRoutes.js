// routes/orderRoutes.js
import express from 'express';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';

const router = express.Router();

router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { shipping, payment } = req.body;

    // 1. Fetch the current cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Build order items
    const items = cart.products.map(p => ({
      product: p._id,
      quantity: p.quantity,
      price: p.price,
    }));

    // 3. Compute totalAmount
    const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    // 4. Create and save the order
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: Date.now(),
      // if you want to store shipping/payment details on the order, add them here
    });
    await order.save();

    // 5. Clear the user's cart
    await Cart.findOneAndDelete({ userId });

    return res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price imageUrl');
    return res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:userId/:orderId', async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.product', 'name price imageUrl');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
