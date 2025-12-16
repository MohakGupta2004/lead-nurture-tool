import mongoose from "mongoose";

const RealtorSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, required: true, unique: true },
        phNo: { type: String, required: false },
        licenseNumber: { type: String, required: false },
        address: { type: String, required: false },
        brokerageName: { type: String, required: false },
        professionalEmail: { type: String, required: false },
       yearsInBusiness: { type: Number, required: false },
       markets: [{ type: String}],
       profileImageUrl: { type: String, required: false },
       realtorType: { type: String, enum: ['Individual', 'Agency'], required: false },
       calendlyLink: { type: String, required: false },
       signatureImageUrl: { type: String, required: false },
       brandLogoUrl: { type: String, required: false },
       brokerageLogoUrl: { type: String, required: false },
       subscriptionPlan: { 
           type: String, 
           enum: ['free', 'pro', 'premium', 'enterprise'], 
           default: 'free',
           required: true 
       },
       campaignsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CampaignModel' }],
    },
    { timestamps: true }
);

export const RealtorModel = mongoose.model("RealtorModel", RealtorSchema);