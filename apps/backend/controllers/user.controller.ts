import type { Request, Response } from "express";
import { clerkClient } from "@clerk/express";
import { RealtorModel } from "../models/realtor.model";
import { UserModel } from "../models/user.model";

export const getOnboardStatus = async (req: Request, res: Response) => {
  try {
    const clerkUserId = req.userId;
    const currentUser = req.user;
    console.log(currentUser);

    if (!clerkUserId || !currentUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const realtor = await RealtorModel.findOne({ clerkUserId });
    console.log(realtor);
    if (realtor) {
      return res.json({
        isOnboarded: true,
      });
    }

    res.json({
      isOnboarded: false,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user information" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const clerkUserId = req.userId;
    const currentUser = req.user;
    console.log(currentUser);
    if (!clerkUserId || !currentUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const realtor = await RealtorModel.findOne({ clerkUserId });

    if (realtor) {
      return res.json({
        id: realtor._id,
        clerkUserId: realtor.clerkUserId,
        username:
          clerkUser.username ||
          clerkUser.emailAddresses[0]?.emailAddress ||
          "User",
        email: clerkUser.emailAddresses[0]?.emailAddress,
        profileImageUrl: realtor.profileImageUrl || clerkUser.imageUrl,
        isOnboarded: true,
        phNo: realtor.phNo,
        brokerageName: realtor.brokerageName,
        professionalEmail: realtor.professionalEmail,
        yearsInBusiness: realtor.yearsInBusiness,
        markets: realtor.markets,
        realtorType: realtor.realtorType,
        calendlyLink: realtor.calendlyLink,
        signatureImageUrl: realtor.signatureImageUrl,
        brandLogoUrl: realtor.brandLogoUrl,
        brokerageLogoUrl: realtor.brokerageLogoUrl,
        subscriptionPlan: realtor.subscriptionPlan,
        createdAt: realtor.createdAt,
      });
    }

    res.json({
      id: currentUser._id,
      clerkUserId: currentUser.clerkUserId,
      username: currentUser.username,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl,
      isOnboarded: false,
      createdAt: currentUser.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user information" });
  }
};

export const createOrUpdateRealtor = async (req: Request, res: Response) => {
  try {
    const clerkUserId = req.userId;
    const currentUser = req.user;

    if (!clerkUserId || !currentUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      firstName,
      lastName,
      businessName,
      licenseNumber,
      phoneNumber,
      address,
      // Optional existing fields
      phNo,
      brokerageName,
      professionalEmail,
      yearsInBusiness,
      markets,
      realtorType,
      calendlyLink,
      signatureImageUrl,
      brandLogoUrl,
      brokerageLogoUrl,
      profileImageUrl,
      subscriptionPlan,
    } = req.body;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const defaultProfileImage = clerkUser.imageUrl;

    let realtor = await RealtorModel.findOne({ clerkUserId });

    if (realtor) {
      Object.assign(realtor, {
        firstName,
        lastName,
        phNo: phoneNumber || phNo,
        brokerageName: businessName || brokerageName,
        licenseNumber: licenseNumber,
        address: address,
        professionalEmail,
        yearsInBusiness,
        markets,
        realtorType,
        calendlyLink,
        signatureImageUrl,
        brandLogoUrl,
        brokerageLogoUrl,
        profileImageUrl: profileImageUrl || defaultProfileImage,
        subscriptionPlan: subscriptionPlan || realtor.subscriptionPlan,
      });
      await realtor.save();
    } else {
      realtor = new RealtorModel({
        clerkUserId,
        firstName,
        lastName,
        phNo: phoneNumber || phNo,
        brokerageName: businessName || brokerageName,
        licenseNumber: licenseNumber,
        address: address,
        professionalEmail,
        yearsInBusiness,
        markets,
        realtorType,
        calendlyLink,
        signatureImageUrl,
        brandLogoUrl,
        brokerageLogoUrl,
        profileImageUrl: profileImageUrl || defaultProfileImage,
        subscriptionPlan: subscriptionPlan || "free",
        campaignsId: [],
      });
      await realtor.save();
    }

    res.json(realtor);
  } catch (error) {
    console.error("Error creating/updating realtor:", error);
    res
      .status(500)
      .json({ error: "Failed to create or update realtor profile" });
  }
};
