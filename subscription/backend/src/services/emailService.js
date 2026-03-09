import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const canSendEmails = env.smtpHost && env.smtpUser && env.smtpPass;

const transporter = canSendEmails
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass
      }
    })
  : null;

export const sendRenewalReminderEmail = async ({ to, subscriptionName, amount, nextBillingAt }) => {
  if (!transporter) {
    return;
  }

  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject: `Upcoming renewal: ${subscriptionName}`,
    text: `Your ${subscriptionName} subscription renews on ${new Date(nextBillingAt).toDateString()} for $${amount}.`
  });
};
