import OpenAI from "openai";
import { z } from "zod";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const MailSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

export type MailInterface = z.infer<typeof MailSchema>;


interface RealtorContext {
  username?: string | null;
  brokerageName?: string | null;
  professionalEmail?: string | null;
  phNo?: string | null;
  yearsInBusiness?: number | null;
  markets?: string[] | null;
  realtorType?: "Individual" | "Agency" | null;
  address?: string | null;
}


export const generateAIMail = async (
  topic: string,
  realtorContext: RealtorContext
): Promise<MailInterface> => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
            You are a senior real estate email copywriter with 10+ years of experience
            writing calm, trust-building nurture emails for realtors.

            Goals:
            - Build trust, not urgency
            - Reduce hesitation
            - Sound human and personal

            Rules:
            - No hype
            - No sales pressure
            - Short sentences
            - Friendly, conversational tone
        `,
      },
      {
        role: "user",
        content: `
            Write a real estate lead-nurture email on this topic:

            "${topic}"

            Requirements:
            - Subject: 3 to 6 words, friendly and curiosity-driven
            - Body: 3 to 4 short paragraphs
            - Each paragraph: 1 to 2 sentences
            - End with a soft CTA (reply / check-in)

            Personalization:
            - Use realtor context naturally
            - Ignore missing or null fields

            Realtor context:
            ${JSON.stringify(realtorContext)}

            ### Example
            Topic: Checking in after inquiry

            Output:
            {
              "subject": "Just checking in",
              "body": "Hi there,\n\nI wanted to check in and see how your home search is going so far. A lot of buyers take some time before things start to feel clear, and that’s completely normal.\n\nIf anything you’ve seen recently raised questions, I’m always happy to share an honest perspective.\n\nNo rush at all — feel free to reply whenever it’s helpful."
            }

            Now generate a NEW email.
          `,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "mail",
        strict: true,
        schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            body: { type: "string" },
          },
          required: ["subject", "body"],
          additionalProperties: false,
        },
      },
    },
  });

  const choice = completion.choices[0];
  if (!choice || !choice.message.content) {
    throw new Error("AI did not return content");
  }

  const mail = JSON.parse(choice.message.content);
  return MailSchema.parse(mail);
};
