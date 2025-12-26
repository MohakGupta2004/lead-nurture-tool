import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";
import { MailModel } from "../models/mails.model.js";
import { CampaignModel } from "../models/campaing.model.js";
import { LeadModel } from "../models/lead.model.js";
import { sendMail, sendBatchMails } from "../services/mails.service.js";
import { generateUnsubscribeToken } from "../utils/unsubscribeToken.js";
import connectDB from "../db/db.ts";
import dotenv from "dotenv";
dotenv.config();
connectDB();
import {
  basicTemplate,
  brandedTemplate,
  professionalTemplate,
  modernTemplate,
} from "../templates/templateHandler.ts";


console.log("Email worker starting...");

new Worker(
  "email-queue",
  async (job) => {

    if (job.name === "send-sequence-email-batch") {
      const { mailId, stepId, realtor, recipients } = job.data;
      console.log("Processing batch job:", job.id, "Recipients:", recipients.length);
      if (!realtor) {
        console.error("Realtor data missing in job, skipping");
        return;
      }
      console.log("Yoo")
      let mail
      try {
        mail = await MailModel.findById(mailId).lean();
      } catch (error) {
        console.error("Error fetching mail doc:", error);
        return;
      }
      if (!mail) {
        console.log("Mail doc not found, skipping");
        return;
      }
      const campaign = await CampaignModel.findById(mail.campaignId).lean();
      if (!campaign || campaign.status !== "Active") {
        console.log("Campaign not active or not found, skipping");
        return;
      }

      console.log(recipients)
      const step = mail.steps.find((s) => s.stepId === stepId);
      if (!step) {
        console.log("Step missing, skipping");
        return;
      }
      const unsubscribedLeads = await LeadModel.find({
        email: { $in: recipients },
        unsubscribed: true,
      })
        .select("email")
        .lean();

      const unsubscribedEmails = new Set(unsubscribedLeads.map((l) => l.email));
      const validRecipients = recipients.filter(
        (email: string) => !unsubscribedEmails.has(email)
      );

      if (validRecipients.length === 0) {
        console.log("All recipients unsubscribed, skipping batch");
        return;
      }
      const emailsToSend = validRecipients.map((recipient: string) => {
        const token = generateUnsubscribeToken(mail._id.toString(), recipient);
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/mail/unsubscribe?token=${token}`;

        let html: string;
        console.log("mail Template Style ", mail.templateStyle);
        console.log("Realtor details for email", realtor);
        switch (mail.templateStyle) {
          case "branded":
            html = brandedTemplate(
              step.subject!,
              step.body!,
              realtor,
              unsubscribeUrl
            );
            break;
          case "professional":
            html = professionalTemplate(
              step.subject!,
              step.body!,
              realtor,
              unsubscribeUrl
            );
            break;
          case "modern":
            html = modernTemplate(
              step.subject!,
              step.body!,
              realtor,
              unsubscribeUrl
            );
            break;
          default:
            html = basicTemplate(
              step.subject!,
              step.body!,
              realtor,
              unsubscribeUrl
            );
        }

        return {
          to: recipient,
          subject: step.subject!,
          html,
          unsubscribeUrl,
        };
      });

      try {
        await sendBatchMails(emailsToSend);
        console.log(
          "Batch emails sent. Count:",
          emailsToSend.length,
          "Step:",
          step.step
        );
      } catch (err: any) {
        console.error("Batch email send failed:", err.message);
        throw err;
      }
      return;
    }


  },
  {
    connection,
    concurrency: 5,
  }
);

console.log("Email worker ready, wating");
