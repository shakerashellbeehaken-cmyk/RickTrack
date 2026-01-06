import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rickshawNumber: {
      type: String,
      required: true,
    },

    tripType: {
      type: String, // ✅ FREE TEXT (NO ENUM)
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
