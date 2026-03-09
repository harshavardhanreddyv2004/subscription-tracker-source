import cron from "node-cron";
import { prisma } from "../config/prisma.js";
import { sendRenewalReminderEmail } from "../services/emailService.js";

export const startReminderJob = () => {
  cron.schedule("0 8 * * *", async () => {
    const now = new Date();
    const soon = new Date(now);
    soon.setDate(now.getDate() + 3);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
        nextBillingAt: {
          gte: now,
          lte: soon
        }
      },
      include: { user: true }
    });

    await Promise.all(
      subscriptions.map((subscription) =>
        sendRenewalReminderEmail({
          to: subscription.user.email,
          subscriptionName: subscription.name,
          amount: Number(subscription.amount).toFixed(2),
          nextBillingAt: subscription.nextBillingAt
        })
      )
    );
  });
};
