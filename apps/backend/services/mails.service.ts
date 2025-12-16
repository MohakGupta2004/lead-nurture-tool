import {mg} from "./mailgun.service.js";

export const sendMail = async ({
  to,
  subject,
  html,
  text,
  replyTo,
  unsubscribeUrl,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  unsubscribeUrl: string;
}) => {
  return mg.messages.create(process.env.MAILGUN_DOMAIN as string, {
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,

    ...(replyTo && { "h:Reply-To": replyTo }),

    "h:List-Unsubscribe": `<${unsubscribeUrl}>`,
    "h:List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  });
};
