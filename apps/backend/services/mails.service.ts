import { resend } from "./resend.service.js";

export const sendMail = async ({
  to,
  subject,
  html,
  text,
  replyTo,
  unsubscribeUrl,
  scheduledAt,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  unsubscribeUrl: string;
  scheduledAt?: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: process.env.MAIL_FROM as string,
    to,
    subject,
    html,
    text,
    replyTo,
    scheduledAt: scheduledAt,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  return data;
};

export const sendBatchMails = async (
  emails: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    unsubscribeUrl: string;
  }[]
) => {
  const batchPayload = emails.map((email) => ({
    from: process.env.MAIL_FROM as string,
    to: email.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: email.replyTo,
    headers: {
      "List-Unsubscribe": `<${email.unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  }));

  const { data, error } = await resend.batch.send(batchPayload);

  if (error) {
    console.error("Resend batch error:", error);
    throw new Error(error.message);
  }

  return data;
};
