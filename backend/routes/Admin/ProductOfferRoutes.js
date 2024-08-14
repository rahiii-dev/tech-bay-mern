import express from 'express';
import { createProductOffer, getProductOffer, editProductOffer } from '../../controllers/productOfferController.js';

const router = express.Router();

router.post('/product-offer', createProductOffer);

router.get('/product-offer/:productId', getProductOffer);

router.put('/product-offer/:productId', editProductOffer);

export default router;
