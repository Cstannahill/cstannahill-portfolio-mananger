/**
 * Project-related types and interfaces for MDX components and data models.
 * @module types/project
 */

import type { ProjectTechnology } from "./technology"; // Updated to ProjectTechnology
import type { ProjectTag } from "./tag"; // Added import for ProjectTag
export type { ProjectTechnology }; // Re-export ProjectTechnology

/**
 * Props for ProjectTechStack component.
 */
export interface ProjectTechStackProps {
  technologies: ProjectTechnology[]; // Updated to ProjectTechnology
}

/**
 * Timeline item for ProjectTimeline component.
 */
export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  status?: "completed" | "in-progress" | "planned";
}

/**
 * Props for ProjectTimeline component.
 */
export interface ProjectTimelineProps {
  items: TimelineItem[];
}

/**
 * Feature for ProjectFeatureShowcase component.
 */
export interface Feature {
  title: string;
  description: string;
  status?: string;
}

/**
 * Feature group for ProjectFeatureShowcase component.
 */
export interface FeatureGroup {
  title: string;
  image?: string;
  features: Feature[];
}

/**
 * Props for ProjectFeatureShowcase component.
 */
export interface ProjectFeatureShowcaseProps {
  groups: FeatureGroup[];
}

/**
 * Metric for ProjectMetrics component.
 */
export interface Metric {
  label: string;
  value: string;
  icon?: string;
  progress?: number;
}

/**
 * Props for ProjectMetrics component.
 */
export interface ProjectMetricsProps {
  metrics: Metric[];
}

/**
 * Props for ProjectChallengeCard component.
 */
export interface ProjectChallengeCardProps {
  title: string;
  challenge: string;
  solution: string;
  impact?: string;
  difficulty?: string;
  domain?: string;
}

export type ProjectSlugParams = { slug: string };

/**
 * Project data model for dashboard and API usage.
 * Matches the IProject interface from the Mongoose model.
 * @see /models/Project.ts
 */
export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  technologies: (string | ProjectTechnology)[]; // Can be string IDs or populated objects
  tags: (string | ProjectTag)[]; // Updated to use ProjectTag, can be string IDs or populated objects
  images: string[];
  coverImage?: string;
  demoUrl?: string;
  sourceUrl?: string;
  publishedAt: string; // ISO string for consistency
  updatedAt: string; // ISO string for consistency
  createdAt: string; // Added createdAt field
  featured: boolean;
  status: "draft" | "published" | "archived";
  metadata?: Record<string, unknown>;
}

/**
 * Represents the data structure for creating or updating a project.
 * This is typically used in forms and API request payloads.
 * @interface ProjectFormInput
 */
export interface ProjectFormInput
  extends Omit<
    Partial<Project>,
    "_id" | "slug" | "createdAt" | "updatedAt" | "technologies" | "tags"
  > {
  title: string;
  summary: string;
  content: string;
  technologies?: string[]; // Array of technology IDs
  tags?: string[]; // Array of tag IDs
  // Omitting _id, slug, createdAt, updatedAt as they are typically server-generated or handled differently
}

/**
 * Represents the filters that can be applied when fetching a list of projects.
 * @interface ProjectFilters
 */
export interface ProjectFilters {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  tag?: string; // Filter by a single tag ID or slug
  technology?: string; // Filter by a single technology ID or slug
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "title";
  sortOrder?: "asc" | "desc";
  search?: string; // For full-text search on title, summary, content
}
