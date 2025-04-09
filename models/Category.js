import { Schema, model, models } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

export const Category = models.Category || model('Category', categorySchema);