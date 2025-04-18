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

// POST add or update product in cart
router.post('/:userId', async (req, res) => {
  const { product } = req.body;
  const { userId } = req.params;

  if (!product || !product._id || !product.name || !product.price) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ ...product, quantity: product.quantity || 1 }] });
    } else {
      const index = cart.products.findIndex((p) => p._id === product._id);
      if (index > -1) {
        cart.products[index].quantity += product.quantity || 1;
      } else {
        cart.products.push({ ...product, quantity: product.quantity || 1 });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("❌ Error saving cart:", err.message);
    res.status(500).json({ error: err.message });
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
