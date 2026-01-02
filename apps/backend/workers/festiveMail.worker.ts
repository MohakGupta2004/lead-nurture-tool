import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";
import { RealtorModel } from "../models/realtor.model.js";
import { FestiveSendModel } from "../models/festiveSend.model.js";
import { LeadModel } from "../models/lead.model.js";
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

        // Fetch lead name for personalization
        let leadName: string | undefined;
        try {
            const lead = await LeadModel.findById(leadId).select("name").lean();
            leadName = lead?.name;
        } catch (error) {
            console.error("Error fetching lead name:", error);
            // Continue without name if fetch fails
        }

        try {
            const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?leadId=${leadId}`;

            const html = festiveTemplate({
                body: body,
                subject: subject,
                realtor: {
                    clerkUserId: realtor.clerkUserId,
                    firstName: realtor.firstName,
                    lastName: realtor.lastName,
                    brokerageName: realtor.brokerageName || undefined,
                    professionalEmail: realtor.professionalEmail || undefined,
                    phNo: realtor.phNo || undefined,
                    yearsInBusiness: realtor.yearsInBusiness || undefined,
                    markets: realtor.markets || undefined,
                    profileImageUrl: realtor.profileImageUrl || undefined,
                    realtorType: realtor.realtorType || undefined,
                    calendlyLink: realtor.calendlyLink || undefined,
                    signatureImageUrl: realtor.signatureImageUrl || undefined,
                    brandLogoUrl: realtor.brandLogoUrl || undefined,
                    brokerageLogoUrl: realtor.brokerageLogoUrl || undefined,
                },
                unsubscribeUrl,
                leadName
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
