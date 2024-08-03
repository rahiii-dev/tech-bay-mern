import mongoose from "mongoose";


// Category Offer Schema
const CategoryOfferSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  discountPercentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

export const CategoryOffer = mongoose.model('CategoryOffer', CategoryOfferSchema);

// Product Offer Schema
const ProductOfferSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  discountPercentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

export const ProductOffer = mongoose.model('ProductOffer', ProductOfferSchema);
