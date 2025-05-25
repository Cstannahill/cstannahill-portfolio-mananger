import mongoose, { Schema, Document } from "mongoose";
import type { ProjectTechnology, ProjectTag } from "../types"; // Using specific types for conceptual alignment

export interface IProject extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  technologies: string[]; // Schema stores array of strings (names or IDs)
  tags: string[]; // Schema stores array of strings (names or IDs)
  images: string[];
  coverImage?: string;
  demoUrl?: string;
  sourceUrl?: string;
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;
  status: "draft" | "published" | "archived";
  metadata: {
    [key: string]: any;
  };
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    technologies: [{ type: String }],
    tags: [{ type: String }],
    images: [{ type: String }],
    coverImage: { type: String },
    demoUrl: { type: String },
    sourceUrl: { type: String },
    publishedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
