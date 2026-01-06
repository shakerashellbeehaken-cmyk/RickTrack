import mongoose from "mongoose";

const rickshawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    number: {
      type: String,
      required: true,
    },

    lastTripType: {
      type: String, // ✅ FREE TEXT
    },

    totalRides: {
      type: Number,
      default: 1,
    },

    repeatCount: {
      type: Number,
      default: 0,
    },

    lastRideDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rickshaw", rickshawSchema);
