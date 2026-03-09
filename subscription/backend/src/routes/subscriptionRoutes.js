import { Router } from "express";
import {
  createSubscription,
  deleteSubscription,
  listSubscriptions,
  setBudgetLimit,
  updateSubscription
} from "../controllers/subscriptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

export const subscriptionRoutes = Router();

subscriptionRoutes.use(authenticate);
subscriptionRoutes.get("/", listSubscriptions);
subscriptionRoutes.post("/", createSubscription);
subscriptionRoutes.put("/:id", updateSubscription);
subscriptionRoutes.delete("/:id", deleteSubscription);
subscriptionRoutes.patch("/budget", setBudgetLimit);
