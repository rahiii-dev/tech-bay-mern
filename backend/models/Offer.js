import mongoose from "mongoose";

// Category Offer Schema
const CategoryOfferSchema = new mongoose.Schema({
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true,
  },
  discountPercentage: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  deleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export const CategoryOffer = mongoose.model('CategoryOffer', CategoryOfferSchema);

// Product Offer Schema
const ProductOfferSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
  },
  discount: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export const ProductOffer = mongoose.model('ProductOffer', ProductOfferSchema);
