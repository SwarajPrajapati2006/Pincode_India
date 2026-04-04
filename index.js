// ─── Load environment variables first ───
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const pincodeRoutes = require("./routes/pincodeRoutes");

const app = express();

// ─── Middleware ───
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas — AllindiaPincode");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ─── API Routes ───
app.use("/api", pincodeRoutes);

// ─── Root health check ───
app.get("/", (req, res) => {
  res.json({ message: "Indian Pincode API is running 🚀" });
});

// ─── Start Server ───
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});