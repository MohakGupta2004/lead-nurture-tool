import type { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { emailQueue } from '../queues/emailQueue.js';
import { MailModel } from '../models/mails.model.js';
import { generateMail } from '../services/generateMail.service.js';
import { basicTemplate, brandedTemplate, professionalTemplate, modernTemplate } from '../email-templates/emailTemplates.js';

const DELAY_DAYS = 5;
const SECONDS_PER_DAY = 24 * 60 * 60;

interface RealtorContextForMail {
    username?: string | null;
    brokerageName?: string | null;
    professionalEmail?: string | null;
    phNo?: string | null;
    yearsInBusiness?: number | null;
    markets?: string[] | null;
    realtorType?: "Individual" | "Agency" | null;
    address?: string | null;
}


const generateEmailPreview = (subject: string, body: string, templateStyle: string, realtor: any): string => {
    switch (templateStyle?.toLowerCase()) {
        case 'branded':
            return brandedTemplate(subject, body, realtor);
        case 'professional':
            return professionalTemplate(subject, body, realtor);
        case 'modern':
            return modernTemplate(subject, body, realtor);
        case 'basic':
        default:
            return basicTemplate(subject, body, realtor);
    }
};

export const generateEmails = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor;
        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { to } = req.body;
        if (!to) {
            return res.status(400).json({ error: 'Recipient email (to) is required' });
        }
        const realtorContext: RealtorContextForMail = {
            username: req.user.username || '',
            brokerageName: realtor.brokerageName || '',
            professionalEmail: realtor.professionalEmail || '',
            phNo: realtor.phNo || '',
            yearsInBusiness: realtor.yearsInBusiness || 0,
            markets: realtor.markets || [],
            realtorType: realtor.realtorType || 'Individual',
            address: realtor.address || ''
        };
        const mailContent = await Promise.all([
            generateMail('Introduction and initial contact', realtorContext),
            generateMail('Market insights and property updates', realtorContext),
            generateMail('Personalized recommendations', realtorContext),
            generateMail('Follow-up and next steps', realtorContext)
        ]);

        res.json({
            success: true,
            mails: mailContent.map((mail, index) => ({
                mail: {
                    mailNo: index + 1,
                    subject: mail.mail.subject,
                    body: mail.mail.body
                }
            }))
        });
    } catch (error) {
        console.error('Error generating emails:', error);
        res.status(500).json({ error: 'Failed to generate emails' });
    }
};

export const confirmEmails = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor;
        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { to, mails, templateStyle = 'basic' } = req.body;

        if (!to) {
            return res.status(400).json({ error: 'Recipient email (to) is required' });
        }
        if (!mails || !Array.isArray(mails) || mails.length === 0) {
            return res.status(400).json({ error: 'Mails array is required' });
        }

        const allowedTemplates = getTemplatePermissions(realtor.subscriptionPlan);
        const requestedTemplate = templateStyle.toLowerCase();

        if (!allowedTemplates.includes(requestedTemplate)) {
            return res.status(403).json({
                error: 'Template access denied',
                message: `The '${requestedTemplate}' template requires a higher subscription plan.`,
                allowedTemplates: allowedTemplates,
                currentPlan: realtor.subscriptionPlan || 'free',
                upgradeRequired: true
            });
        }

        const mailDoc = await MailModel.create({
            to,
            status: 'active',
            templateStyle: requestedTemplate,
            steps: mails.map((m, index) => ({
                stepId: uuid(),
                step: index,
                sent: false,
                subject: m.mail.subject,
                body: m.mail.body
            }))
        });

        for (const step of mailDoc.steps) {
            const delaySeconds = step.step === 0 ? 0 : step.step * DELAY_DAYS * SECONDS_PER_DAY;
            const delayDescription = step.step === 0 ? 'immediate' : `${step.step * DELAY_DAYS} days`;

            console.log(`Queuing email step ${step.step} for ${to} - ${delayDescription}`);

            await emailQueue.add(
                'send-email',
                { mailId: mailDoc._id, stepId: step.stepId, realtorId: realtor._id },
                {
                    delay: delaySeconds * 1000,
                    removeOnComplete: true
                }
            );
        }

        res.json({
            success: true,
            mailId: mailDoc._id,
            message: `Successfully queued ${mailDoc.steps.length} emails for delivery`,
            steps: mailDoc.steps.map(step => ({
                stepId: step.stepId,
                step: step.step,
                delayDays: step.step === 0 ? 0 : step.step * DELAY_DAYS
            }))
        });
    } catch (error) {
        console.error('Error confirming emails:', error);
        res.status(500).json({ error: 'Failed to confirm emails' });
    }
};

const getTemplatePermissions = (realtorPlan: string | undefined) => {
    const planPermissions = {
        'free': ['basic'],
        'pro': ['basic', 'branded'],
        'premium': ['basic', 'branded', 'professional'],
        'enterprise': ['basic', 'branded', 'professional', 'modern']
    };

    return planPermissions[realtorPlan as keyof typeof planPermissions] || ['basic'];
};

export const getMailPreview = async (req: Request, res: Response) => {
    try {
        const realtor = req.realtor;
        if (!realtor) {
            return res.status(403).json({ error: 'Realtor access required' });
        }

        const { subject, body, templateStyle = 'basic' } = req.query;

        if (!subject || !body) {
            return res.status(400).json({ error: 'Subject and body are required as query parameters' });
        }

        const allowedTemplates = getTemplatePermissions(realtor.subscriptionPlan);
        const requestedTemplate = (templateStyle as string).toLowerCase();

        if (!allowedTemplates.includes(requestedTemplate)) {
            return res.status(403).json({
                error: 'Template access denied',
                message: `The '${requestedTemplate}' template requires a higher subscription plan.`,
                allowedTemplates: allowedTemplates,
                currentPlan: realtor.subscriptionPlan || 'free',
                upgradeRequired: true
            });
        }

        const previewHtml = generateEmailPreview(
            subject as string,
            body as string,
            requestedTemplate,
            realtor
        );
        res.send(previewHtml);
    } catch (error) {
        console.error('Error generating mail preview:', error);
        res.status(500).json({ error: 'Failed to generate mail preview' });
    }
};