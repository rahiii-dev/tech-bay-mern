import express from "express";
import { getSalesReport } from "../../controllers/salesController.js";

const router = express.Router();

router.get('/sales-report', getSalesReport);

export default router
