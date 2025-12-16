import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';

import leadRoutes from './routes/lead.routes';
import campaingRoutes from './routes/campaing.routes';
import userRoutes from './routes/user.routes';
import mailRoutes from './routes/mail.routes';

import { requireAuthApi, requiredRealtorAuth, requireAuthWithUserCreation } from './middleware/auth.middleware';

dotenv.config();
import connectDB from './db/db';

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/test-onboarding', (req, res) => {
  console.log('Test onboarding called with:', req.body);
  console.log('Headers:', req.headers);
  res.json({ message: 'Test endpoint working', received: req.body });
});

app.post('/api/test-auth', requireAuthWithUserCreation, (req, res) => {
  console.log('Authenticated test endpoint reached');
  res.json({ message: 'Authentication successful', userId: req.userId });
});

app.use('/api/users', userRoutes);

app.use('/api/leads', requireAuthApi, requiredRealtorAuth, leadRoutes);

app.use('/api/campaigns', requireAuthApi, requiredRealtorAuth, campaingRoutes);

app.use('/api/mail', requireAuthApi, requiredRealtorAuth, mailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});