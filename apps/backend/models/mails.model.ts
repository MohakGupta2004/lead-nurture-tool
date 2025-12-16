import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  stepId: { type: String, required: true },
  step: { type: Number, required: true },
  sent: { type: Boolean, default: false },
  sentAt: { type: Date },
  subject: { type: String },
  body: { type: String },
  error: { type: String }
});

const mailSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'CampaignModel' },
    steps: [stepSchema],

    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active"
    },

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
