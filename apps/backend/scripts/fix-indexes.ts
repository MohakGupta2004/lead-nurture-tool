import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env from parent directory using process.cwd()
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/realtygenie";

// Define Schema locally to avoid import issues
const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, // Removed unique: true
    phNo: { type: String },
    realtorId: { type: mongoose.Schema.Types.ObjectId, ref: 'RealtorModel', required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'CampaignModel', required: true },
    address: { type: String },
    unsubscribed: { type: Boolean, default: false }
}, { timestamps: true }
);

// Compound index to ensure email is unique per campaign
LeadSchema.index({ email: 1, campaignId: 1 }, { unique: true });

const LeadModel = mongoose.model("LeadModel", LeadSchema);

const fixIndexes = async () => {
    try {
        console.log("Connecting to MongoDB at", mongoURI);
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        // List indexes
        const indexes = await LeadModel.collection.indexes();
        console.log("Current indexes:", indexes);

        // Drop the incorrect unique index on email if it exists
        const emailIndex = indexes.find(idx => idx.name === 'email_1');
        if (emailIndex) {
            console.log("Dropping incorrect unique index on email...");
            try {
                await LeadModel.collection.dropIndex('email_1');
                console.log("Dropped 'email_1' index.");
            } catch (e) {
                console.log("Error dropping index (might not exist):", e);
            }
        } else {
            console.log("'email_1' index not found.");
        }

        // Sync indexes to create the new compound index defined in the model
        console.log("Syncing indexes...");
        await LeadModel.syncIndexes();
        console.log("Indexes synced.");

        const newIndexes = await LeadModel.collection.indexes();
        console.log("New indexes:", newIndexes);

        process.exit(0);
    } catch (error) {
        console.error("Error fixing indexes:", error);
        process.exit(1);
    }
};

fixIndexes();
