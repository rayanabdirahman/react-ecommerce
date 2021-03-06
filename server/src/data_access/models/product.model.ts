import { IProduct } from './interfaces';
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 32 },
  description: { type: String, required: true, maxlength: 2000 },
  price: { type: Number, required: true, maxlength: 32 },
  category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
  quantity: { type: Number },
  sold: { type: Number, default: 0 },
  photo: { data: Buffer, contentType: String },
  shipping: { type: Boolean, required: false },

}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
