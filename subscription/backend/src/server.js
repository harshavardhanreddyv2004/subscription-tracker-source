import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { startReminderJob } from "./jobs/reminderJob.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(env.port, () => {
      startReminderJob();
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Unable to start server", error);
    process.exit(1);
  }
};

startServer();
