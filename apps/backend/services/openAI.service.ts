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
            You are a senior real estate email copywriter with over 10 years of experience
            working with top-performing individual realtors and brokerages.

            Your emails are used for LONG-TERM LEAD NURTURING — not closing.
            These emails should make the reader feel:
            - Understood
            - Comfortable
            - Respected
            - Never rushed

            PRIMARY OBJECTIVE:
            Build trust and familiarity so that when the lead is ready,
            the realtor is the first person they think of.

            AUDIENCE:
            - Buyers or sellers who have shown interest
            - They are curious but cautious
            - Timing is uncertain
            - They dislike pushy sales behavior

            TONE & STYLE:
            - Calm
            - Warm
            - Professional but human
            - Conversational (sounds like a real person wrote it)
            - Short, clear sentences
            - No corporate or marketing jargon

            ABSOLUTE RULES:
            - Never sound salesy
            - Never pressure the reader
            - Never exaggerate
            - No hype words (amazing, unbelievable, best deal, once-in-a-lifetime, etc.)
            - No emojis
            - No markdown
            - Output must strictly follow the provided JSON schema

            QUALITY BAR:
            These emails should feel “touchy” and thoughtful —
            the kind of email someone reads fully instead of skimming.

            ### System Example 1 (Using Context)
            Realtor context:
            {
              "username": "Alex",
              "yearsInBusiness": 8,
              "markets": ["Austin"]
            }

            Topic:
            First-time buyer hesitation

            Output quality:
            {
              "subject": "Totally understandable",
              "body": "Hi there,\n\nBuying your first home can feel overwhelming, especially with so many opinions and mixed signals out there. Most first-time buyers I speak with feel exactly the same way.\n\nAfter working in the Austin market for several years, I’ve seen how helpful it can be to simply understand the process without rushing into decisions.\n\nIf you ever want to talk things through or ask something small, feel free to reply."
            }

            ### System Example 2 (Seller Context)
            Realtor context:
            {
              "username": "Sarah",
              "brokerageName": "Oak Realty",
              "yearsInBusiness": 12
            }

            Topic:
            Unsure about selling timeline

            Output quality:
            {
              "subject": "No rush at all",
              "body": "Hi there,\n\nMany homeowners I speak with aren’t sure about timing, especially with how the market keeps shifting.\n\nIn my experience at Oak Realty, even understanding your options without committing to anything can bring a lot of clarity.\n\nIf it helps, you’re always welcome to reply and share what you’re thinking."
            }

            Follow this exact quality level and emotional tone.
          `,
      },
      {
        role: "user",
        content: `
              Write a real estate lead-nurture email on this topic:

              "${topic}"

              REQUIREMENTS:
              - Subject: 3 to 6 words
              - Subject must feel personal and curiosity-driven
              - Body: 3 to 4 short paragraphs
              - Each paragraph: 1 to 2 sentences only
              - Use natural line breaks between paragraphs
              - End with a soft, optional CTA (replying, checking in, asking a question)

              PERSONALIZATION RULES:
              - Use realtor context naturally and subtly
              - Reference experience, market familiarity, or name only if it fits naturally
              - Do NOT mention missing or null fields
              - Do NOT dump context mechanically

              REALTOR CONTEXT:
              ${JSON.stringify(realtorContext)}

              ### User Example 1
              Topic:
              Checking in after open house visit

              Context:
              {
                "username": "Mark",
                "yearsInBusiness": 10,
                "markets": ["San Diego"]
              }

              Expected Output:
              {
                "subject": "Just checking in",
                "body": "Hi there,\n\nI wanted to check in and see what thoughts came up after the open house. It’s very common for things to feel unclear at this stage.\n\nAfter working with buyers around San Diego for years, I’ve learned that clarity often comes with time and the right information.\n\nIf you have any questions at all, feel free to reply."
              }

              ### User Example 2
              Topic:
              Seller worried about market conditions

              Context:
              {
                "username": "Emily",
                "brokerageName": "Harbor Homes",
                "yearsInBusiness": 6
              }

              Expected Output:
              {
                "subject": "Market questions?",
                "body": "Hi there,\n\nA lot of homeowners I speak with are feeling uncertain about the market right now, and that’s completely understandable.\n\nAt Harbor Homes, we often help sellers simply explore what their options look like without any pressure to act.\n\nIf you’d like, you can reply and let me know what’s been on your mind."
              }

              Now generate a NEW email for the given topic using the same quality, tone, and structure.
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

export const generateFestiveMail = async (
  festival: string,
  realtorContext: RealtorContext
): Promise<MailInterface> => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
            You are a warm, friendly, and professional real estate agent.
            You are sending a festive greeting email to your leads.

            OBJECTIVE:
            - Wish the lead a happy \${festival}.
            - Keep it short, sweet, and genuine.
            - NO SALES PITCH. This is purely relationship building.
            - Make them feel remembered and valued.

            TONE:
            - Warm
            - Festive
            - Professional but personal
            - Gratitude-focused

            RULES:
            - Subject must be catchy and festive (e.g., "Wishing you joy this \${festival}", "Happy \${festival} from [Name]")
            - Body should be 2-3 short paragraphs.
            - Mention the festival explicitly.
            - Sign off with the realtor's name/brokerage if available.
            - Output must strictly follow the provided JSON schema.
          `,
      },
      {
        role: "user",
        content: `
            Write a festive email for the festival: "\${festival}"

            REALTOR CONTEXT:
            \${JSON.stringify(realtorContext)}
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
