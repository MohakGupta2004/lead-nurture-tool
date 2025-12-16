import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phNo: { type: String }, // Optional phone number
    realtorId: { type: mongoose.Schema.Types.ObjectId, ref: 'RealtorModel', required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'CampaignModel', required: true }, // Required campaign
    address: { type: String },
    }, { timestamps: true }
);

export const LeadModel = mongoose.model("LeadModel", LeadSchema);