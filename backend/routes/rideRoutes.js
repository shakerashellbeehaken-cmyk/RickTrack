import express from "express";
import { addRide, getRickshaws, updateRickshaw, deleteRickshaw } from "../controllers/rideController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { getAllRides } from "../controllers/rideController.js";



const router = express.Router();

// router.post("/ride", addRide);
// router.get("/rickshaws", getRickshaws);
// router.get("/rickshaws/:id", getRickshawByID);
// router.put("/rickshaw/:id", updateRickshaw);
// router.delete("/rickshaw/:id", deleteRickshaw);

router.post("/ride", protect, addRide);

//only admin can edit/delete
router.put("/rickshaw/:id", protect, authorize("admin"), updateRickshaw);
router.delete("/rickshaw/:id", protect, authorize("admin"), deleteRickshaw);

//both admin & user can read
router.get("/rickshaws", protect, getRickshaws);
router.get(
  "/rides/all",
  protect,
  authorize("admin"),
  getAllRides
);


export default router;
