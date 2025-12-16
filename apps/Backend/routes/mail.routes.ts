import express from 'express';
import { 
    generateEmails, 
    confirmEmails, 
    getMailPreview 
} from '../controllers/mail.controller';

const router = express.Router();

// Generate AI-powered email sequence
router.post('/generate', generateEmails);

// Confirm and automatically queue emails for delivery
router.post('/confirm', confirmEmails);

// Generate HTML preview for email content
router.get('/preview', getMailPreview);

export default router;