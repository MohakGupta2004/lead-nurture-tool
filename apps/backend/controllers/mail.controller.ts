import type { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { emailQueue } from "../queues/emailQueue.js";
import { MailModel } from "../models/mails.model.js";
import { CampaignModel } from "../models/campaing.model.js";
import { generateMail } from "../services/generateMail.service.js";
import {
  basicTemplate,
  brandedTemplate,
  professionalTemplate,
  modernTemplate,
} from "../templates/templateHandler.js";

const DELAY_DAYS = 5;
const SECONDS_PER_DAY = 24 * 60 * 60;

interface RealtorContextForMail {
  username?: string | null;
  brokerageName?: string | null;
  professionalEmail?: string | null;
  phNo?: string | null;
  yearsInBusiness?: number | null;
  markets?: string[] | null;
  realtorType?: "Individual" | "Agency" | null;
  address?: string | null;
}

const generateEmailPreview = (
  subject: string,
  body: string,
  templateStyle: string,
  realtor: any
): string => {
  switch (templateStyle?.toLowerCase()) {
    case "branded":
      return brandedTemplate(subject, body, realtor, "#");
    case "professional":
      return professionalTemplate(subject, body, realtor, "#");
    case "modern":
      return modernTemplate(subject, body, realtor, "#");
    case "basic":
    default:
      return basicTemplate(subject, body, realtor, "#");
  }
};

export const generateEmails = async (req: Request, res: Response) => {
  try {
    const realtor = req.realtor;
    if (!realtor) {
      return res.status(403).json({ error: "Realtor access required" });
    }
    const { campaignId } = req.body;
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    let city = campaign.city;
    if(!city) city = "your city";

    const realtorContext: RealtorContextForMail = {
      username: req.user.username || "",
      brokerageName: realtor.brokerageName || "",
      professionalEmail: realtor.professionalEmail || "",
      phNo: realtor.phNo || "",
      yearsInBusiness: realtor.yearsInBusiness || 0,
      markets: realtor.markets || [],
      realtorType: realtor.realtorType || "Individual",
      address: realtor.address || "",
    };

    const mailContent = await Promise.all([
      generateMail("Introduction and initial contact", realtorContext, city),
      generateMail("Market insights and property updates", realtorContext, city),
      generateMail("Personalized recommendations", realtorContext, city),
      generateMail("Follow-up and next steps", realtorContext, city),
    ]);

    res.json({
      success: true,
      mails: mailContent.map((mail, index) => ({
        mail: {
          mailNo: index + 1,
          subject: mail.mail.subject,
          body: mail.mail.body,
        },
      })),
    });
  } catch (error) {
    console.error("Error generating emails:", error);
    res.status(500).json({ error: "Failed to generate emails" });
  }
};


export const confirmEmails = async (req: Request, res: Response) => {
  try {
    const realtor = req.realtor;
    if (!realtor) {
      return res.status(403).json({ error: "Realtor access required" });
    }

    const { campaignId, mails, templateStyle = "basic" } = req.body;

    const campaign = await CampaignModel.findById(campaignId)
      .populate("leads")
      .exec();

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.status !== "Active") {
      return res.status(400).json({ error: "Campaign is not active" });
    }

    const leads = (campaign.leads as any[]).filter(
      (lead) => !lead.unsubscribed
    );

    if (leads.length === 0) {
      return res.status(400).json({ error: "No active leads found" });
    }

    if (!mails || !Array.isArray(mails) || mails.length === 0) {
      return res.status(400).json({ error: "Mails array is required" });
    }

    const allowedTemplates = getTemplatePermissions(
      realtor.subscriptionPlan
    );
    const requestedTemplate = templateStyle.toLowerCase();

    if (!allowedTemplates.includes(requestedTemplate)) {
      return res.status(403).json({
        error: "Template access denied",
        upgradeRequired: true,
      });
    }

    const mailDoc = await MailModel.create({
      campaignId: campaign._id,
      templateStyle: requestedTemplate,
      steps: mails.map((m, index) => ({
        stepId: uuid(),
        step: index,
        subject: m.mail.subject,
        body: m.mail.body,
      })),
    });

    const leadEmails = leads.map((lead) => lead.email);
    const BATCH_SIZE = 50;

    for (let i = 0; i < leadEmails.length; i += BATCH_SIZE) {
      const batch = leadEmails.slice(i, i + BATCH_SIZE);

      for (const step of mailDoc.steps) {
        const delaySeconds =
          step.step === 0 ? 0 : step.step * DELAY_DAYS * SECONDS_PER_DAY;

        await emailQueue.add(
          "send-sequence-email-batch",
          {
            mailId: mailDoc._id,
            stepId: step.stepId,
            realtor,
            recipients: batch,
          },
          {
            delay: delaySeconds * 1000,
            removeOnComplete: true,
          }
        );
      }
    }

    res.json({
      success: true,
      totalLeads: leads.length,
      totalEmailsQueued: leads.length * mailDoc.steps.length,
    });
  } catch (error) {
    console.error("Error confirming emails:", error);
    res.status(500).json({ error: "Failed to confirm emails" });
  }
};


const getTemplatePermissions = (realtorPlan: string | undefined) => {
  const planPermissions = {
    free: ["basic"],
    pro: ["basic", "branded"],
    premium: ["basic", "branded", "professional"],
    enterprise: ["basic", "branded", "professional", "modern"],
  };

  return (
    planPermissions[realtorPlan as keyof typeof planPermissions] || ["basic"]
  );
};

export const getMailPreview = async (req: Request, res: Response) => {
  try {
    const realtor = req.realtor;
    if (!realtor) {
      return res.status(403).json({ error: "Realtor access required" });
    }
    const { subject, body, templateStyle = "basic" } = req.query;

    if (!subject || !body) {
      return res
        .status(400)
        .json({ error: "Subject and body are required as query parameters" });
    }

    const allowedTemplates = getTemplatePermissions(realtor.subscriptionPlan);
    const requestedTemplate = (templateStyle as string).toLowerCase();

    if (!allowedTemplates.includes(requestedTemplate)) {
      return res.status(403).json({
        error: "Template access denied",
        message: `The '${requestedTemplate}' template requires a higher subscription plan.`,
        allowedTemplates: allowedTemplates,
        currentPlan: realtor.subscriptionPlan || "free",
        upgradeRequired: true,
      });
    }

    const previewHtml = generateEmailPreview(
      subject as string,
      body as string,
      requestedTemplate,
      realtor
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(previewHtml);
  } catch (error) {
    console.error("Error generating mail preview:", error);
    res.status(500).json({ error: "Failed to generate mail preview" });
  }
};

export const getMailsByCampaignId = async (req: Request, res: Response) => {
  const realtor = req.realtor;
  if (!realtor) {
    return res.status(403).json({ error: "Realtor access required" });
  }

  try {
    const campaign = await CampaignModel.findById(req.params.campaignId).exec();

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (campaign.realtorId.toString() !== realtor._id.toString()) {
      return res.status(403).json({ error: "Realtor access denied" });
    }

    const mails = await MailModel.find({
      campaignId: campaign._id,
    }).exec();

    res.json(mails);
  } catch (error) {
    console.error("Error fetching mails by campaign ID:", error);
    res.status(500).json({ error: "Failed to fetch mails by campaign ID" });
  }
};

