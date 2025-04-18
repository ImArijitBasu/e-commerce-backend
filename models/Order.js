const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  cartDetails: {
    shipping: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      zip: { type: String, required: true },
    },
    payment: {
      card: { type: String, required: true },
      expiry: { type: String, required: true },
      cvv: { type: String, required: true },
    },
  },
  status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now },
});
