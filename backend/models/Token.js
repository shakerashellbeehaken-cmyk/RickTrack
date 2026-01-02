import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // auto delete after 7 days
  },
});

export default mongoose.model("Token", tokenSchema);
