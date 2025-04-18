import express from 'express';
import { Cart } from '../models/Cart.js';

const router = express.Router();

// GET user cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, products: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { shipping, payment } = req.body;

    // Fetch the current cart
    const cart = await Cart.findOne({ userId }).populate('products._id');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items
    const items = cart.products.map((p) => ({
      product: p._id._id,
      quantity: p.quantity,
      price: p.price,
    }));

    // Compute totalAmount
    const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    // Create and save the order
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      cartDetails: { shipping, payment },
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: Date.now(),
    });
    await order.save();

    // Clear the user's cart
    await Cart.findOneAndDelete({ userId });

    return res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


// PUT update quantity
router.put('/:userId/:productId', async (req, res) => {
  const { quantity } = req.body;
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = cart.products.find((p) => p._id === productId);
    if (product) {
      product.quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product from cart
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { products: { _id: req.params.productId } } },
      { new: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE entire cart
router.delete('/:userId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
