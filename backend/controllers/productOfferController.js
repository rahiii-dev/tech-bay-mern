import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import { ProductOffer } from "../models/Offer.js";

/*  
    Route: POST api/admin/product-offer
    Purpose: create offer for product
*/
export const createProductOffer = asyncHandler(async (req, res) => {
    const { productId, discount, startDate, endDate, isActive } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return handleErrorResponse(res, 404, 'Product not found', {
            title: 'Invalid Product',
            description: 'The specified product does not exist.',
        });
    }

    const newOffer = new ProductOffer({
        productId,
        discount,
        startDate,
        endDate,
        isActive,
    });

    try {
        const savedOffer = await newOffer.save();
        res.status(201).json(savedOffer);
    } catch (error) {
        handleErrorResponse(res, 500, 'Failed to create offer', {
            title: 'Database Error',
            description: error.message,
        });
    }
});

/*  
    Route: GET api/admin/product-offer/:productId
    Purpose: Get a specific product offer by ID
*/
export const getProductOffer = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const offer = await ProductOffer.findOne({productId})

    if (!offer) {
        return handleErrorResponse(res, 404, 'Offer not found', {
            title: 'Invalid Offer',
            description: 'The specified offer does not exist.',
        });
    }

    res.status(200).json(offer);
});

/*  
    Route: PUT api/admin/product-offer/:productId
    Purpose: Edit a specific product offer by ID
*/
export const editProductOffer = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { discount, startDate, endDate, isActive } = req.body;

    let offer = await ProductOffer.findOne({productId})

    if (!offer) {
        return handleErrorResponse(res, 404, 'Offer not found', {
            title: 'Invalid Offer',
            description: 'The specified offer does not exist.',
        });
    }

    // Update the offer
    offer.discount = discount !== undefined ? discount : offer.discount;
    offer.startDate = startDate !== undefined ? startDate : offer.startDate;
    offer.endDate = endDate !== undefined ? endDate : offer.endDate;
    offer.isActive = isActive !== undefined ? isActive : offer.isActive;

    try {
        const updatedOffer = await offer.save();
        res.status(200).json(updatedOffer);
    } catch (error) {
        handleErrorResponse(res, 500, 'Failed to update offer', {
            title: 'Database Error',
            description: error.message,
        });
    }
});
