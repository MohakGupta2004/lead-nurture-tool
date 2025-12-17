import {generateAIMail} from "./openAI.service.js";

export const generateMail = async (topic: string) => {
    const generatedMail = await generateAIMail(topic);
    const mail = {
        subject: generatedMail.subject,
        body: generatedMail.body
    };
    return {
        mail,
        status: "generated"
    } 
};  