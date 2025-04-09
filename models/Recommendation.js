import { Schema, model, models } from 'mongoose';

const recommendationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  recommendedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  generatedAt: { type: Date, default: Date.now },
});

export const Recommendation = models.Recommendation || model('Recommendation', recommendationSchema);