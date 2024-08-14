import { ProductOffer } from "../models/Offer.js";


export const calculateOfferDiscount = async (productId) => {
   const now = new Date();
  const offers = await ProductOffer.find({ 
    productId,
    isActive: true,
    endDate: { $gte: now }
 });
  return offers.length > 0 ? Math.max(...offers.map(offer => offer.discount)) : null;
};

export const calculateFinalPrice = (price, discount) => {
  return discount > 0 ? price - (price * (discount / 100)) : price;
};
