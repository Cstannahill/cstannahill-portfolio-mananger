/**
 * Project type for dashboard and API usage.
 * Matches the IProject interface from the Mongoose model.
 */
export interface ProjectDashboard {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  technologies: string[];
  tags: string[];
  images: string[];
  coverImage?: string;
  demoUrl?: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  status: "draft" | "published" | "archived";
  metadata?: Record<string, unknown>;
}
