import mongoose, { Schema, Document } from "mongoose";
import { AI_PROVIDER } from "@/types/ai-settings"; // Changed from type-only import
import type { AiSettings } from "@/types/ai-settings";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
  aiSettings?: AiSettings; // Added aiSettings field
  createdAt: Date;
  updatedAt: Date;
}

const AiSettingsSchema: Schema = new Schema(
  {
    selectedProvider: {
      type: String,
      enum: Object.values(AI_PROVIDER),
      required: false,
    },
    selectedModelId: { type: String, required: false },
    customPrompt: { type: String, required: false },
    providerSettings: {
      type: Map,
      of: Schema.Types.Mixed,
      required: false,
    },
  },
  { _id: false }
);

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
    aiSettings: { type: AiSettingsSchema, required: false }, // Added aiSettings to schema
  },
  {
    timestamps: true,
  }
);

// Add index on email for faster queries
// UserSchema.index({ email: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
