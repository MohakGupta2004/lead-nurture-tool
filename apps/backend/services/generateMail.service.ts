import {generateAIMail} from "./openAI.service.js";

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


export const generateMail = async (topic: string, realtorContext: RealtorContext) => {
    const generatedMail = await generateAIMail(topic, realtorContext);
    const mail = {
        subject: generatedMail.subject,
        body: generatedMail.body
    };
    return {
        mail,
        status: "generated"
    } 
};  