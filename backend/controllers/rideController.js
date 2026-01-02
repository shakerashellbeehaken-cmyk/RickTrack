import Rickshaw from "../models/Rickshaw.js";
import Ride from "../models/Ride.js";

//add new ride
export const addRide = async (req, res) => {
  const { number, tripType } = req.body;
  const userId = req.user.userId; // from JWT

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
      lastTripType: tripType,
    });
  }

  await Ride.create({
    userId,
    rickshawNumber: number,
    tripType,
  });

  res.json(rickshaw);
};


//get all rickshaws
export const getRickshaws = async (req, res) => {
  try {
    const { role, userId } = req.user;

    let filter = {};

    // 👤 normal user → only own rides
    if (role !== "admin") {
      filter.userId = userId;
    }

    // 👑 admin → sees everything
    const rickshaws = await Rickshaw.find(filter)
      .sort({ repeatCount: -1 })
      .populate("userId", "name email");

    res.json(rickshaws);
  } catch (error) {
    console.error("getRickshaws error:", error);
    res.status(500).json({ message: "Failed to fetch rickshaws" });
  }
};
//GET all rides admin
export const getAllRides = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const rides = await Ride.find()
      .sort({ date: -1 })
      .populate("userId", "name email");

    res.json(rides);
  } catch (error) {
    console.error("getAllRides error:", error);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
};


//get rickshaw by id
// export const getRickshawByID = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const rick = await Rickshaw.findById(id);
//     if (!rick) return res.status(404).json({ message: "rickshaw not found! office  missed shit!" });
//     res.json(rick);
//   } catch (error) {
//     console.log("error in getRickshaw in controllers", error);
//     res.status(500).json({ message: "internal server error" });
//   }
// };

//edit rickshaw
export const updateRickshaw = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, lastRideDate, totalRides, lastTripType } = req.body;

    const safeTotalRides = Math.max(1, Number(totalRides));

    const updated = await Rickshaw.findByIdAndUpdate(
      id,
      {
        number,
        lastRideDate,
        totalRides: safeTotalRides,
        repeatCount: safeTotalRides - 1,
        lastTripType,
      },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


//delete rickshaw
export const deleteRickshaw = async (req, res) => {
  const { id } = req.params;

  await Rickshaw.findByIdAndDelete(id);

  res.json({ message: "Rickshaw deleted" });
};