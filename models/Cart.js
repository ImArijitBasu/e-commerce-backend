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
    quantity: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },

    calculateTotalPrice: function() {
      this.totalPrice = this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
