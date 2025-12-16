import express from 'express';
import { getCurrentUser, createOrUpdateRealtor } from '../controllers/user.controller';
import { requireAuthApi, requireAuthWithUserCreation } from '../middleware/auth.middleware';

const router = express.Router();

// Use regular auth for /me (user should exist)
router.get('/me', requireAuthApi, getCurrentUser);

// Use special auth for onboarding (creates user if needed)
router.post('/onboarding', requireAuthWithUserCreation, createOrUpdateRealtor);

export default router;