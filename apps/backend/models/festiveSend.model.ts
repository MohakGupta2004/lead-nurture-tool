import mongoose from "mongoose";

const festiveSendSchema = new mongoose.Schema(
    {
        realtorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RealtorModel",
            required: true,
            index: true
        },

        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LeadModel",
            required: true,
            index: true
        },

        festival: {
            type: String,
            required: true,
            lowercase: true,
            enum: ["christmas", "diwali", "newyear"]
        },

        status: {
            type: String,
            enum: ["scheduled", "sent", "failed"],
            default: "scheduled"
        },

        sentAt: {
            type: Date
        },

        error: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

festiveSendSchema.index(
    { leadId: 1, festival: 1 },
    { unique: true }
);

export const FestiveSendModel = mongoose.model(
    "FestiveSendModel",
    festiveSendSchema
);
