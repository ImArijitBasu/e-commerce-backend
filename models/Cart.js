import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // product id
  name: String,
  price: Number,
  imageUrl: String,
  quantity: Number,
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    products: [productSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
