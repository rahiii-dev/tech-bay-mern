import mongoose, { set } from 'mongoose';
import { capitalize } from '../utils/capitalize.js';

const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true, set: capitalize },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String, required: true }],
  thumbnail: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true }
}, { 
  timestamps: true 
});


ProductSchema.methods.softDelete = function() {
  this.isActive = false;
  return this.save();
};

ProductSchema.methods.restore = function() {
  this.isActive = true;
  return this.save();
};

export default model('Product', ProductSchema);
