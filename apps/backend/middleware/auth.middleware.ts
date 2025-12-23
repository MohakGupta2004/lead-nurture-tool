import type { Request, Response, NextFunction } from 'express';
import { getAuth, clerkClient } from '@clerk/express';
import { UserModel } from '../models/user.model';
import { RealtorModel } from '../models/realtor.model';

export const requireAuthApi = async (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    
    console.log('requireAuthApi middleware called');
    console.log('User ID:', auth.userId);
    
    if (!auth.userId) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required to access this resource'
        });
    }
    
    const user = await UserModel.findOne({ clerkUserId: auth.userId });
    if (!user) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'User profile not found'
        });
    }
    
    req.userId = auth.userId;
    req.user = user;
    next();
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    if (auth.userId) {
        req.userId = auth.userId;
    }
    next();
};

export const requiredRealtorAuth = async (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    
    console.log('RequiredRealtorAuth middleware called');
    console.log('User ID:', auth.userId);
    
    if (!auth.userId) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required to access this resource'
        });
    }
    
    const user = await UserModel.findOne({ clerkUserId: auth.userId });
    const realtor = await RealtorModel.findOne({ clerkUserId: auth.userId });
    
    console.log('User found:', !!user);
    console.log('Realtor found:', !!realtor);
    console.log('Realtor data:', realtor ? { id: realtor._id, brokerageName: realtor.brokerageName } : 'null');
    
    if (!realtor) {
        console.log('No realtor profile found, returning 403');
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Realtor profile required to access this resource. Please complete onboarding first.'
        });
    }
    
    req.userId = auth.userId;
    req.user = user;
    req.realtor = realtor;
    next();
};

export const requireAuthWithUserCreation = async (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    
    console.log('Auth middleware called');
    console.log('Auth object:', auth);
    console.log('Headers:', req.headers.authorization);
    
    if (!auth.userId) {
        console.log('No userId found in auth');
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required to access this resource'
        });
    }
    
    let user = await UserModel.findOne({ clerkUserId: auth.userId });
    
    if (!user) {
        // Create user if they don't exist (for onboarding)
        try {
            const clerkUser = await clerkClient.users.getUser(auth.userId);
            user = new UserModel({
                clerkUserId: auth.userId,
                username: clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 'user',
                email: clerkUser.emailAddresses[0]?.emailAddress,
                profileImageUrl: clerkUser.imageUrl
            });
            await user.save();
        } catch (error) {
            console.error('Error creating user during onboarding:', error);
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to create user profile'
            });
        }
    }
    
    req.userId = auth.userId;
    req.user = user;
    next();
};

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: any;
            realtor?: any;
        }
    }
}