import express from "express";
import { customerBlock, customerList, customerUnblock } from "../../controllers/customerController.js";

const router = express.Router();

router.get("/customer/list", customerList);
router.put("/customer/:id/block", customerBlock);
router.put("/customer/:id/unblock", customerUnblock);

export default router;
