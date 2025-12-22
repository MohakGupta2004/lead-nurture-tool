import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  stepId: { type: String, required: true },
  step: { type: Number, required: true },
  subject: { type: String },
  body: { type: String },
});

const mailSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'CampaignModel' },
    steps: [stepSchema],

    unsubscribed: { type: Boolean, default: false },
    templateStyle: {
      type: String,
      enum: ['basic', 'branded', 'professional', 'modern'],
      default: 'basic'
    },
  },
  { timestamps: true }
);

export const MailModel = mongoose.model("MailModel", mailSchema);
