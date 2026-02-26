import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import foodRoutes from "./routes/food.routes.js";
import logRoutes from "./routes/log.routes.js";
import waterRoutes from "./routes/water.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: ["*"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/log", logRoutes);
app.use("/api/water", waterRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

export default app;
