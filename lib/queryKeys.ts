import type { ProjectFilters } from "@/types/project";
import type { AI_PROVIDER } from "@/types/ai-settings"; // Import AI_PROVIDER

/**
 * @file Centralized query key definitions for TanStack Query.
 *
 * Query keys are used to uniquely identify and manage queries within the cache.
 * Following a structured approach for defining query keys helps in:
 * - Consistency: Ensures keys are created in a uniform way across the application.
 * - Colocation: Keeps query-related logic grouped.
 * - Refetching/Invalidation: Simplifies targeting specific queries for updates.
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */

/**
 * Base query keys for different data entities.
 * Used to group related queries.
 */
export const queryKeys = {
  all: ["all"] as const,
  projects: ["projects"] as const,
  project: (projectId: string) => [...queryKeys.projects, projectId] as const,
  tasks: (projectId: string) =>
    [...queryKeys.project(projectId), "tasks"] as const,
  task: (projectId: string, taskId: string) =>
    [...queryKeys.tasks(projectId), taskId] as const,
  user: ["user"] as const,
  settings: ["settings"] as const,
  aiSettings: ["settings", "ai"] as const, // Key for AI settings
  aiModels: (provider?: AI_PROVIDER) =>
    provider
      ? (["ai", "models", provider] as const)
      : (["ai", "models"] as const), // Key for AI models, optionally by provider
  blogPosts: ["blogPosts"] as const,
  blogPost: (slugOrId: string) => [...queryKeys.blogPosts, slugOrId] as const,
  // Add other entity base keys here
};

/**
 * Generates query keys for a list of projects.
 * Optionally filters by various project attributes.
 *
 * @param {ProjectFilters} [filters] - Optional filters for projects.
 * @returns {readonly (string | ProjectFilters)[]} Query key array.
 */
export const projectListKeys = (filters?: ProjectFilters) =>
  filters && Object.keys(filters).length > 0
    ? [...queryKeys.projects, "list", { ...filters }]
    : ([...queryKeys.projects, "list"] as const);

/**
 * Generates query keys for a single project's details.
 *
 * @param {string} projectId - The ID of the project.
 * @returns {readonly string[]} Query key array.
 */
export const projectDetailKeys = (projectId: string) =>
  [...queryKeys.project(projectId), "detail"] as const;

/**
 * Generates query keys for a list of tasks within a project.
 * Optionally filters by status.
 *
 * @param {string} projectId - The ID of the project.
 * @param {string} [status] - Optional status to filter tasks by.
 * @returns {readonly (string | { status: string })[]} Query key array.
 */
export const taskListKeys = (projectId: string, status?: string) =>
  status
    ? [...queryKeys.tasks(projectId), "list", { status }]
    : ([...queryKeys.tasks(projectId), "list"] as const);

/**
 * Generates query keys for a single task's details.
 *
 * @param {string} projectId - The ID of the project.
 * @param {string} taskId - The ID of the task.
 * @returns {readonly string[]} Query key array.
 */
export const taskDetailKeys = (projectId: string, taskId: string) =>
  [...queryKeys.task(projectId, taskId), "detail"] as const;

/**
 * Generates query key for the current user's profile.
 *
 * @returns {readonly string[]} Query key array.
 */
export const userProfileKeys = () => [...queryKeys.user, "profile"] as const;

/**
 * Generates query key for application settings.
 *
 * @returns {readonly string[]} Query key array.
 */
export const applicationSettingsKeys = () =>
  [...queryKeys.settings, "application"] as const;

/**
 * Generates query key for AI settings.
 *
 * @returns {readonly string[]} Query key array.
 */
export const aiSettingsKeys = () => [...queryKeys.aiSettings] as const;

/**
 * Generates query key for available AI models, optionally filtered by provider.
 *
 * @param {AI_PROVIDER} [provider] - Optional AI provider to filter models by.
 * @returns {readonly (string | AI_PROVIDER)[]} Query key array.
 */
export const aiModelsKeys = (provider?: AI_PROVIDER) =>
  provider
    ? ([...queryKeys.aiModels(provider)] as const)
    : ([...queryKeys.aiModels()] as const);

/**
 * Generates query keys for a list of blog posts.
 * Optionally filters by author ID or tags.
 *
 * @param {object} [filters] - Optional filters.
 * @param {string} [filters.authorId] - Optional author ID to filter by.
 * @param {string[]} [filters.tags] - Optional tags to filter by.
 * @returns {readonly (string | { authorId?: string; tags?: string[] })[]} Query key array.
 */
export const blogPostListKeys = (filters?: {
  authorId?: string;
  tags?: string[];
}) =>
  filters && (filters.authorId || filters.tags)
    ? [...queryKeys.blogPosts, "list", { ...filters }]
    : ([...queryKeys.blogPosts, "list"] as const);

/**
 * Generates query keys for a single blog post's details (by slug or ID).
 *
 * @param {string} slugOrId - The slug or ID of the blog post.
 * @returns {readonly string[]} Query key array.
 */
export const blogPostDetailKeys = (slugOrId: string) =>
  [...queryKeys.blogPost(slugOrId), "detail"] as const;

// Add more specific key factories as needed, for example:
// export const projectCommentsKeys = (projectId: string) => [...queryKeys.project(projectId), 'comments'] as const;
