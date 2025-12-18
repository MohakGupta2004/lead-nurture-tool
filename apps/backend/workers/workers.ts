import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";
import { MailModel } from "../models/mails.model.js";
import { sendMail } from "../services/mails.service.js";
import { generateUnsubscribeToken } from "../utils/unsubscribeToken.js";

import {
  basicTemplate,
  brandedTemplate,
  professionalTemplate,
  modernTemplate,
} from "../templates/templateHandler.ts";

import { RealtorModel } from "../models/realtor.model.js";

console.log("Email worker starting...");

new Worker(
  "email-queue",
  async (job) => {
    const { mailId, stepId, realtorId } = job.data;

    console.log("Processing job:", job.id, job.data);

    const mail = await MailModel.findById(mailId);
    if (!mail) {
      console.log("Mail doc not found, skipping");
      return;
    }

    if (mail.unsubscribed) {
      console.log("Recipient unsubscribed:", mail.to);
      mail.status = "paused";
      await mail.save();
      return;
    }

    const step = mail.steps.find((s) => s.stepId === stepId);
    if (!step || step.sent) {
      console.log("Step already sent or missing, skipping");
      return;
    }

    const realtor = await RealtorModel.findById(realtorId);
    if (!realtor) {
      throw new Error("Realtor not found");
    }

    try {
      const token = generateUnsubscribeToken(mail._id.toString());
      const unsubscribeUrl =
        `${process.env.BASE_URL}/api/mail/unsubscribe?token=${token}`;

      let html: string;

      switch (mail.templateStyle) {
        case "branded":
          html = brandedTemplate(step.subject!, step.body!, realtor, unsubscribeUrl);
          break;
        case "professional":
          html = professionalTemplate(step.subject!, step.body!, realtor, unsubscribeUrl);
          break;
        case "modern":
          html = modernTemplate(step.subject!, step.body!, realtor, unsubscribeUrl);
          break;
        default:
          html = basicTemplate(step.subject!, step.body!, realtor, unsubscribeUrl);
      }

      await sendMail({
        to: mail.to,
        subject: step.subject!,
        html,
        unsubscribeUrl,
      });

      step.sent = true;
      step.sentAt = new Date();
      step.error = undefined;

      await mail.save();

      console.log("Email sent:", mail.to, "step:", step.step);
    } catch (err: any) {
      console.error("Email send failed:", err.message);

      step.error = err.message;
      await mail.save();

      throw err;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

console.log("Email worker ready, wating");
