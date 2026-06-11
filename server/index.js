import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

// Connect to MongoDB
async function startServer() {
  const MONGO_URI = process.env.MONGO_URI || "";

  if (MONGO_URI) {
    // Use real MongoDB
    console.log("🔌 Connecting to MongoDB...");
    try {
      await mongoose.connect(MONGO_URI);
      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err.message);
      console.log("⚡ Falling back to in-memory MongoDB...");
      await startInMemoryMongo();
    }
  } else {
    // No URI provided — use in-memory
    console.log("📦 No MONGO_URI found. Using in-memory MongoDB...");
    await startInMemoryMongo();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

async function startInMemoryMongo() {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const mongod = new MongoMemoryServer();
  await mongod.start();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log("✅ Connected to in-memory MongoDB at", uri);
}

startServer();
