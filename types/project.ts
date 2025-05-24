/**
 * Project-related types and interfaces for MDX components and data models.
 * @module types/project
 */

import type { Technology } from "./technology";
export type { Technology }; // Added to re-export the imported Technology type

/**
 * Props for ProjectTechStack component.
 */
export interface ProjectTechStackProps {
  technologies: Technology[];
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
  technologies: string[];
  tags: string[];
  images: string[];
  coverImage?: string;
  demoUrl?: string;
  sourceUrl?: string;
  publishedAt: string; // ISO string for consistency
  updatedAt: string; // ISO string for consistency
  featured: boolean;
  status: "draft" | "published" | "archived";
  metadata?: Record<string, unknown>;
}
