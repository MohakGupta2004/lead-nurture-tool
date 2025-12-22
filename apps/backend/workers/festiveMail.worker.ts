import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";
import { RealtorModel } from "../models/realtor.model.js";
import { FestiveSendModel } from "../models/festiveSend.model.js";
import { sendMail } from "../services/mails.service.js";
import { festiveTemplate } from "../templates/templateHandler.js";

console.log("Festive Email Worker starting...");

new Worker(
    "email-queue",
    async (job) => {
        if (job.name !== "send-festive-email") return;

        const { leadId, email, festival, realtorId, runAt, subject, body } = job.data;

        const festiveSend = await FestiveSendModel.findOne({
            leadId,
            festival
        });

        if (!festiveSend || festiveSend.status === "sent") return;

        if (!email) {
            console.error("Missing email in job data for lead:", leadId);
            return;
        }

        const realtor = await RealtorModel.findById(realtorId);
        if (!realtor) throw new Error("Realtor not found");

        try {
            const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?leadId=${leadId}`;

            const html = festiveTemplate({
                body: body,
                subject: subject,
                realtor: {
                    username: realtor.professionalEmail ? realtor.professionalEmail.split('@')[0] : "Realtor",
                    brokerageName: realtor.brokerageName || undefined,
                    professionalEmail: realtor.professionalEmail || undefined,
                    phNo: realtor.phNo || undefined,
                },
                unsubscribeUrl
            });

            await sendMail({
                to: email,
                subject: subject,
                html,
                unsubscribeUrl,
                scheduledAt: runAt
            });

            await FestiveSendModel.updateOne(
                { leadId, festival },
                {
                    status: "sent",
                    sentAt: new Date(),
                    error: null
                }
            );
        } catch (err: any) {
            console.error("Festive mail error:", err);
            await FestiveSendModel.updateOne(
                { leadId, festival },
                {
                    status: "failed",
                    error: err.message
                }
            );

            throw err;
        }
    },
    {
        connection,
        concurrency: 10,
        limiter: {
            max: 50,
            duration: 1000
        }
    }
);

console.log("Festive Email Worker ready");
