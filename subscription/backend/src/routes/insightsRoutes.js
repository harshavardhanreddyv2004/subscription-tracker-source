import { Router } from "express";
import { getInsights, getSmartInsightsData } from "../controllers/insightsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

export const insightsRoutes = Router();

insightsRoutes.use(authenticate);
insightsRoutes.get("/", getInsights);
insightsRoutes.get("/smart", getSmartInsightsData);
