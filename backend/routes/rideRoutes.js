import express from "express";
import {
  addRide,
  getRickshaws,
  updateRickshaw,
  deleteRickshaw,
} from "../controllers/rideController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/ride", protect, addRide);
router.get("/rickshaws", protect, getRickshaws);

// ⬇️ IMPORTANT: NO authorize("admin") HERE
router.put("/rickshaw/:id", protect, updateRickshaw);
router.delete("/rickshaw/:id", protect, deleteRickshaw);

export default router;
