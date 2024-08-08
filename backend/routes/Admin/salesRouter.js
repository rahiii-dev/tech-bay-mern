import express from "express";
import { downloadSalesReport, getSalesReport } from "../../controllers/salesController.js";

const router = express.Router();

router.get('/sales-report', getSalesReport);
router.get('/sales-report/download', downloadSalesReport);

export default router
