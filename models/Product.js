import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const productSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  imageUrl: [String],
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Product = models.Product || model('Product', productSchema);