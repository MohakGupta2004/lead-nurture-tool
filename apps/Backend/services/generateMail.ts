export const generateMail = (topic: String) => {
    const mail = {
        subject: "Demo Subject for mail",
        body: `Dear User, this is a demo mail regarding ${topic}.`
    };
    return {
        subject: mail.subject, body: mail.body, status: "generated"
    } 
};  