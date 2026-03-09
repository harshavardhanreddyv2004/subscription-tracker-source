import { prisma } from "../config/prisma.js";
import { calculateInsights } from "../services/insightsService.js";
import {
  getFinancialForecast,
  getHealthScore,
  getSmartInsights,
  getUsageBreakdown
} from "../services/smartInsightsService.js";

export const getInsights = async (req, res, next) => {
  try {
    const user = req.user;
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id }
    });

    const insights = calculateInsights(subscriptions, user.budgetLimit);
    res.json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
};

export const getSmartInsightsData = async (req, res, next) => {
  try {
    const user = req.user;
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id }
    });

    const baseInsights = calculateInsights(subscriptions, user.budgetLimit);
    const insights = getSmartInsights(subscriptions, user);
    const healthScore = getHealthScore(subscriptions, user);
    const forecast = getFinancialForecast(subscriptions);
    const usageBreakdown = getUsageBreakdown(subscriptions);

    res.json({
      success: true,
      data: {
        insights,
        healthScore,
        forecast,
        usageBreakdown,
        budget: {
          monthlySpend: baseInsights.monthlySpend,
          budgetLimit: baseInsights.budgetLimit,
          budgetRemaining: baseInsights.budgetRemaining,
          budgetStatus: baseInsights.budgetStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
