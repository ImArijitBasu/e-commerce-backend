import { Schema, model, models } from 'mongoose';

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  amount: Number,
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  transactionId: String,
  paymentDate: { type: Date, default: Date.now },
});

export const Payment = models.Payment || model('Payment', paymentSchema);