import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

  rickshawNumber: String,
  tripType: {
    type: String,
    enum: ["Home → Office", "Office → Home"]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Ride", rideSchema);
