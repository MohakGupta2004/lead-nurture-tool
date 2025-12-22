import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";
import { FestiveTriggerModel } from "../models/festiveTrigger.model.js";
import { LeadModel } from "../models/lead.model.js";
import { FestiveSendModel } from "../models/festiveSend.model.ts";
import { emailQueue } from "../queues/emailQueue.js";
import { RealtorModel } from "../models/realtor.model.js";
import { generateFestiveMail } from "../services/openAI.service.js";

console.log("Festival Trigger Worker starting...");

new Worker(
  "email-queue",
  async (job) => {
    if (job.name !== "festival-trigger") return;

    const { triggerId, realtorId, festival, runAt } = job.data;

    const trigger = await FestiveTriggerModel.findOneAndUpdate(
      {
        _id: triggerId,
        enabled: true,
        status: "pending",
      },
      {
        status: "processing",
      },
      { new: true }
    );

    if (!trigger) return;

    const leads = await LeadModel.find({
      realtorId,
      unsubscribed: false
    }).select("_id email");

    if (leads.length === 0) {
      console.warn("No leads found, reverting trigger execution status");
      await FestiveTriggerModel.updateOne(
        { _id: triggerId },
        { status: "pending" }
      );
      return;
    }

    const allLeadIds = leads.map(l => l._id.toString());
    const leadEmailMap = new Map(leads.map(l => [l._id.toString(), l.email]));

    const existingSends = await FestiveSendModel.find({
      festival,
      leadId: { $in: allLeadIds }
    }).select("leadId");

    const existingLeadIds = new Set(existingSends.map(s => s.leadId.toString()));
    const newLeadIds = allLeadIds.filter(id => !existingLeadIds.has(id));

    if (newLeadIds.length === 0) return;

    const realtor = await RealtorModel.findById(realtorId).lean();
    if (!realtor) {
      console.error("Realtor not found for trigger:", realtorId);
      return;
    }

    const realtorContext = {
      username: realtor.professionalEmail
        ? realtor.professionalEmail.split("@")[0]
        : "Realtor",
      brokerageName: realtor.brokerageName || undefined,
      professionalEmail: realtor.professionalEmail || undefined,
      phNo: realtor.phNo || undefined,
    };

    let aiSubject = "";
    let aiBody = "";

    try {
      const aiMail = await generateFestiveMail(festival, realtorContext);
      aiSubject = aiMail.subject;
      aiBody = aiMail.body;

    } catch (err) {
      console.error("Failed to generate AI content:", err);
      await FestiveTriggerModel.updateOne(
        { _id: triggerId },
        { status: "failed" }
      );
      throw err;
    }

    const festiveSendsToInsert = newLeadIds.map(leadId => ({
      leadId,
      festival,
      realtorId,
      status: "scheduled",
    }));

    await FestiveSendModel.insertMany(festiveSendsToInsert, { ordered: false });

    const jobs = newLeadIds.map(leadId => ({
      name: "send-festive-email",
      data: {
        leadId,
        email: leadEmailMap.get(leadId),
        festival,
        realtorId,
        runAt,
        subject: aiSubject,
        body: aiBody,
      },
      opts: {
        jobId: `send-festive-email:${leadId}:${festival}`,
        removeOnComplete: true,
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 30000,
        },
      }
    }));

    await emailQueue.addBulk(jobs);

    await FestiveTriggerModel.updateOne(
      { _id: triggerId },
      { status: "completed" }
    );
  },
  {
    connection
  }
);

console.log("Festival Trigger Worker ready");
