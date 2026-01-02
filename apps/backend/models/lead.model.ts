import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, // Removed unique: true
    phNo: { type: String }, // Optional phone number
    realtorId: { type: mongoose.Schema.Types.ObjectId, ref: 'RealtorModel', required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'CampaignModel', required: true }, // Required campaign
    address: { type: String },
    unsubscribed: { type: Boolean, default: false }
}, { timestamps: true }
);

// Compound index to ensure email is unique per campaign
LeadSchema.index({ email: 1, campaignId: 1 }, { unique: true });

export const LeadModel = mongoose.model("LeadModel", LeadSchema);