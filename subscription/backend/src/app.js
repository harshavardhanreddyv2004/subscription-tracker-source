import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { authRoutes } from "./routes/authRoutes.js";
import { insightsRoutes } from "./routes/insightsRoutes.js";
import { subscriptionRoutes } from "./routes/subscriptionRoutes.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrls,
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Subscription Tracker API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/insights", insightsRoutes);

app.use(notFound);
app.use(errorHandler);
