import Rickshaw from "../models/Rickshaw.js";
import Ride from "../models/Ride.js";

/* ================= ADD RIDE ================= */
export const addRide = async (req, res) => {
  try {
    const { number, tripType } = req.body;
    const userId = req.user.userId;

    let rickshaw = await Rickshaw.findOne({ number, userId });

    if (rickshaw) {
      rickshaw.totalRides += 1;
      rickshaw.repeatCount += 1;
      rickshaw.lastRideDate = new Date();
      rickshaw.lastTripType = tripType;
      await rickshaw.save();
    } else {
      rickshaw = await Rickshaw.create({
        userId,
        number,
        totalRides: 1,
        repeatCount: 0,
        lastRideDate: new Date(),
        lastTripType: tripType,
      });
    }

    await Ride.create({
      userId,
      rickshawNumber: number,
      tripType,
      date: new Date(),
    });

    res.json(rickshaw);
  } catch (error) {
    console.error("addRide error:", error);
    res.status(500).json({ message: "Failed to add ride" });
  }
};

/* ================= GET RICKSHAWS ================= */
export const getRickshaws = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : { userId: req.user.userId };

    const rickshaws = await Rickshaw.find(filter)
      .populate("userId", "name email")
      .sort({ lastRideDate: -1 });

    res.json(rickshaws);
  } catch (error) {
    console.error("getRickshaws error:", error);
    res.status(500).json({ message: "Failed to fetch rickshaws" });
  }
};

/* ================= UPDATE ================= */
export const updateRickshaw = async (req, res) => {
  try {
    const rickshaw = await Rickshaw.findById(req.params.id);
    if (!rickshaw) {
      return res.status(404).json({ message: "Rickshaw not found" });
    }

    const ownerId =
      typeof rickshaw.userId === "object"
        ? rickshaw.userId._id.toString()
        : rickshaw.userId.toString();

    if (
      req.user.role !== "admin" &&
      ownerId !== req.user.userId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { number, lastTripType, totalRides, lastRideDate } = req.body;

    rickshaw.number = number ?? rickshaw.number;
    rickshaw.lastTripType = lastTripType ?? rickshaw.lastTripType;
    rickshaw.totalRides = Math.max(1, Number(totalRides));
    rickshaw.repeatCount = rickshaw.totalRides - 1;
    rickshaw.lastRideDate = lastRideDate ?? rickshaw.lastRideDate;

    await rickshaw.save();
    res.json(rickshaw);
  } catch (error) {
    console.error("updateRickshaw error:", error);
    res.status(500).json({ message: "Failed to update rickshaw" });
  }
};

/* ================= DELETE ================= */
export const deleteRickshaw = async (req, res) => {
  try {
    const rickshaw = await Rickshaw.findById(req.params.id);
    if (!rickshaw) {
      return res.status(404).json({ message: "Rickshaw not found" });
    }

    const ownerId =
      typeof rickshaw.userId === "object"
        ? rickshaw.userId._id.toString()
        : rickshaw.userId.toString();

    if (
      req.user.role !== "admin" &&
      ownerId !== req.user.userId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await rickshaw.deleteOne();
    res.json({ message: "Rickshaw deleted" });
  } catch (error) {
    console.error("deleteRickshaw error:", error);
    res.status(500).json({ message: "Failed to delete rickshaw" });
  }
};
