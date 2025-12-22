import mongoose from "mongoose";

const festiveTriggerSchema = new mongoose.Schema({
    realtorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RealtorModel",
        required: true
    },
    festival: {
        type: String,
        required: true,
        lowercase: true,
        enum: ["christmas", "diwali", "newyear"]
    },

    runAt: {
        type: Date,
        required: true
    },

    enabled: {
        type: Boolean,
        default: true
    },

    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending"
    }
},
    {
        timestamps: true
    }
);

festiveTriggerSchema.index(
    { realtorId: 1, festival: 1 },
    { unique: true }
);

export const FestiveTriggerModel = mongoose.model("FestiveTriggerModel", festiveTriggerSchema);