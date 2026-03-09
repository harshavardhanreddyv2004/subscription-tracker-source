import dotenv from "dotenv";

dotenv.config();

const toBool = (value) => String(value).toLowerCase() === "true";

export const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174").split(",").map((u) => u.trim()),
  databaseUrl: process.env.DATABASE_URL || "",
  emailFrom: process.env.EMAIL_FROM || "tracker@example.com",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: toBool(process.env.SMTP_SECURE || "false"),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production"
};
