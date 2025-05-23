import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string; // Also supports 'summary' in frontmatter
  content: string;
  tags: string[];
  images: string[];
  coverImage?: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  status: "draft" | "published";
  metadata: {
    views: number;
    readingTime: number;
    likes: number;
    [key: string]: any;
  };
  dashboardData: {
    relatedPosts: mongoose.Types.ObjectId[];
    seoScore: number;
    engagementMetrics: {
      averageTimeOnPage: number;
      bounceRate: number;
      socialShares: number;
    };
    [key: string]: any;
  };
}

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true }, // Also supports 'summary' in frontmatter
    content: { type: String, required: true },
    tags: [{ type: String }],
    images: [{ type: String }],
    coverImage: { type: String },
    author: { type: String, default: "Admin" },
    publishedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    metadata: {
      views: { type: Number, default: 0 },
      readingTime: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
    dashboardData: {
      relatedPosts: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }],
      seoScore: { type: Number, default: 0 },
      engagementMetrics: {
        averageTimeOnPage: { type: Number, default: 0 },
        bounceRate: { type: Number, default: 0 },
        socialShares: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
