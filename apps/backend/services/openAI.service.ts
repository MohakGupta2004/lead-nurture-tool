import OpenAI from "openai";
import { z } from "zod";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const MailSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

export type MailInterface = z.infer<typeof MailSchema>;


export const generateAIMail = async (topic: string): Promise<MailInterface> => {
  const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    input: [
      {
        role: "system",
        content: `
            You are a professional real estate email copywriter.

            Your job:
            - Write short, warm, trust-building emails
            - Audience: realtors nurturing buyer or seller leads
            - Tone: human, friendly, calm, non-pushy

            STRICT RULES:
            - Output ONLY valid JSON
            - No markdown
            - No explanations
            - No extra text
        `
      },
      {
        role: "user",
        content: `
            Write a nurturing real estate email on the topic:
            "${topic}"

            Return JSON in EXACT format:
            {
            "subject": "string",
            "body": "string"
            }

            Guidelines:
            - Subject: short, curiosity-driven, friendly
            - Body: 3 to 4 short paragraphs
            - End with a soft CTA (reply / question / check-in) (if required by the topic)
        `
      }
    ]
  });

  const rawText = response.output_text;

  if (!rawText) {
    throw new Error("AI returned empty response");
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    throw new Error("AI did not return valid JSON");
  }

  const result = MailSchema.safeParse(parsedJson);

  if (!result.success) {
    throw new Error("AI JSON failed schema validation");
  }
  console.log("AI generated mail response:", result.data);
  return result.data;
};
