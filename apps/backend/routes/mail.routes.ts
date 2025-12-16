import express from 'express';
import { MailModel } from '../models/mails.model.ts';
import { verifyUnsubscribeToken } from '../utils/verifyUnsubscribeToken';
import { 
    generateEmails, 
    confirmEmails, 
    getMailPreview 
} from '../controllers/mail.controller';

const router = express.Router();

router.post('/generate', generateEmails);

router.post('/confirm', confirmEmails);

router.get('/preview', getMailPreview);

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

    const { mailId } = payload;

    const mail = await MailModel.findById(mailId);

    if (!mail) {
      return res.send(`
        <html>
          <body style="font-family:Arial;text-align:center;padding:40px">
            <h2>You’re unsubscribed</h2>
            <p>You will no longer receive emails from RealtyGenie.</p>
          </body>
        </html>
      `);
    }

    if (!mail.unsubscribed) {
      mail.unsubscribed = true;
      mail.status = "paused";
      await mail.save();
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


export default router;