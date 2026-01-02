import mongoose from "mongoose";

const rickshawSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

  number: {
    type: String,
    required: true,
    unique: true
  },
  lastTripType: {
  type: String,
  enum: ["Home → Office", "Office → Home"],
  default: "Home → Office",
},
  totalRides: {
    type: Number,
    default: 1
  },
  repeatCount: {
    type: Number,
    default: 0
  },
  lastRideDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Rickshaw", rickshawSchema);
