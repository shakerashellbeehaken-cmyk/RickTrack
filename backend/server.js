import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import rideRoutes from "./routes/rideRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api", rideRoutes);

app.get("/", (req, res) => {
  res.send("RickTrack API running 🚲");
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("Mongo error:", err));
