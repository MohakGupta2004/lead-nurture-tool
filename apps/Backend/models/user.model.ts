import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },        
        profileImageUrl: { type: String, required: false },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model("UserModel", userSchema);