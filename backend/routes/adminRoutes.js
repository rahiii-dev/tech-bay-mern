import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import {
  customerBlock,
  customerList,
  customerUnblock,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get("/customer/list", customerList);
router.put("/customer/:id/block", customerBlock);
router.put("/customer/:id/unblock", customerUnblock);

export default router;
