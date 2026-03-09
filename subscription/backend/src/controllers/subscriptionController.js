import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";

const parseDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const validatePayload = (payload) => {
  const required = ["name", "category", "amount", "billingCycle", "nextBillingAt"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Amount must be a positive number";
  }

  if (!["MONTHLY", "YEARLY"].includes(payload.billingCycle)) {
    return "Billing cycle must be MONTHLY or YEARLY";
  }

  if (!parseDate(payload.nextBillingAt)) {
    return "nextBillingAt must be a valid date";
  }

  return null;
};

export const listSubscriptions = async (req, res, next) => {
  try {
    const user = req.user;
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: [{ isActive: "desc" }, { nextBillingAt: "asc" }]
    });

    res.json({ success: true, data: subscriptions, user });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: validationError });
    }

    const user = req.user;
    const usesPerMonth = req.body.usesPerMonth != null ? Number(req.body.usesPerMonth) : null;
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        name: req.body.name.trim(),
        category: req.body.category.trim(),
        amount: req.body.amount,
        billingCycle: req.body.billingCycle,
        nextBillingAt: parseDate(req.body.nextBillingAt),
        isActive: req.body.isActive ?? true,
        usesPerMonth: usesPerMonth != null && usesPerMonth > 0 ? usesPerMonth : null,
        notes: req.body.notes?.trim() || null
      }
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: validationError });
    }

    const usesPerMonth = req.body.usesPerMonth != null ? Number(req.body.usesPerMonth) : undefined;
    const subscription = await prisma.subscription.update({
      where: { id: req.params.id, userId: req.user.id },
      data: {
        name: req.body.name.trim(),
        category: req.body.category.trim(),
        amount: req.body.amount,
        billingCycle: req.body.billingCycle,
        nextBillingAt: parseDate(req.body.nextBillingAt),
        isActive: req.body.isActive ?? true,
        ...(usesPerMonth !== undefined && { usesPerMonth: usesPerMonth > 0 ? usesPerMonth : null }),
        notes: req.body.notes?.trim() || null
      }
    });

    res.json({ success: true, data: subscription });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Subscription not found" });
    }
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    await prisma.subscription.delete({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Subscription not found" });
    }
    next(error);
  }
};

export const setBudgetLimit = async (req, res, next) => {
  try {
    const budgetLimit = Number(req.body.budgetLimit);
    if (!Number.isFinite(budgetLimit) || budgetLimit <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "budgetLimit must be positive" });
    }

    const user = req.user;
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { budgetLimit }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
