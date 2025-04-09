import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  image: { type: String },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },

  // Relationships
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // User's orders
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }], // User's reviews
  recommendations: { type: Schema.Types.ObjectId, ref: 'Recommendation' }, // User's recommendations
});

export const User = models.User || model('User', userSchema);