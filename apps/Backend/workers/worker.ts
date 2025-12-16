import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";

console.log("Worker starting...");

new Worker(
  "email-queue",
  async (job) => {
    console.log("Worker active");
    console.log("Job received:", job.data);

    // TODO: integrate with actual email service (send email)

    console.log("Worker finished job");
  },
  {
    connection
  }
);

console.log("Worker is now BLOCKED");
console.log("waiting for jobs...");
