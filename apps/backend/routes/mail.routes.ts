import express from "express";
import { MailModel } from "../models/mails.model.ts";
import { LeadModel } from "../models/lead.model.ts";
import { verifyUnsubscribeToken } from "../utils/verifyUnsubscribeToken";

import {
  generateEmails,
  confirmEmails,
  getMailPreview,
  getMailsByCampaignId,
} from "../controllers/mail.controller";

import { festiveTriggerController } from "../controllers/festiveTrigger.controller";

const router = express.Router();

router.post("/generate", generateEmails);
router.post("/confirm", confirmEmails);

// previews & queries
router.get("/preview", getMailPreview);
router.get("/getMailsByCampaignId/:campaignId", getMailsByCampaignId);

// unsubscribe route
router.get("/unsubscribe", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).send("Invalid unsubscribe link");
    }

    const payload = verifyUnsubscribeToken(token);

    if (!payload) {
      return res.status(400).send("Invalid or expired unsubscribe link");
    }

    const { mailId, email } = payload;

    const [mail, lead] = await Promise.all([
      MailModel.findById(mailId),
      LeadModel.findOne({ email }),
    ]);

    if (!mail || !lead) {
      return res.send(`
        <html>
          <body style="font-family:Arial;text-align:center;padding:40px">
            <h2>You’re unsubscribed</h2>
            <p>You will no longer receive emails from RealtyGenie.</p>
          </body>
        </html>
      `);
    }

    if (!lead.unsubscribed) {
      lead.unsubscribed = true;
      await lead.save();
    }

    res.send(`
      <html>
        <body style="font-family:Arial;text-align:center;padding:40px">
          <h2>You’re unsubscribed</h2>
          <p>You will no longer receive emails from RealtyGenie.</p>
          <p style="font-size:12px;color:#777">
            If this was a mistake, you can contact support.
          </p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Unsubscribe error:", err);
    res.status(500).send("Something went wrong");
  }
});

// festive trigger
router.post("/festiveTrigger", festiveTriggerController);

export default router;
