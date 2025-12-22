import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
    {
        campaignName: { type: String, required: true },
        objective: { type: String, required: true },
        targetPersona: { type: String, required: true },
        description: { type: String, required: false },
        status: { type: String, enum: ['Active', 'Paused', 'Completed'], required: true },
        realtorId: { type: mongoose.Schema.Types.ObjectId, ref: 'RealtorModel', required: true },
        leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeadModel' }],
        mailIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MailModel' }],
        city: { type: String, required: false },
    },{timestamps: true}
);

export const CampaignModel = mongoose.model("CampaignModel", CampaignSchema);