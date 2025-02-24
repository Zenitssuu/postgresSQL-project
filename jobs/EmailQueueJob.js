import { Queue, Worker } from "bullmq";
import { defaultQueueConfig, queueRedisConnection } from "../config/queue.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../config/nodemailer.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
  connection: queueRedisConnection,
  defaultJobOptions: defaultQueueConfig,
});

// workers
export const handler = new Worker(
  emailQueueName,
  async (job) => {
    // console.log("email worker data is", job.data);
    console.log("email worker data is scanned in email handler");
    const data = job.data;
    data?.map(async (item) => {
      await sendEmail(item.toEmail, item.subject, item.body);
    });
  },
  { connection: queueRedisConnection }
);

// worker listeners
handler.on("completed", (job) => {
  logger.info({ job: job, message: "job completed" });
  console.log("job completed", job.id);
});

handler.on("failed", (job) => {
  logger.error({ job: job, message: "job failed" });
  console.log("job failed", job.id);
});
