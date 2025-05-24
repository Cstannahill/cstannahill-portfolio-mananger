/**
 * @typescript Rule - Strict Explicit Typing:
 * All object properties must be explicitly typed via interfaces or type aliases.
 */

/**
 * Represents the summary of a blog post, typically used in lists.
 */
export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string; // ISO date string
  tags: string[]; // Array of tag names or IDs
  coverImage?: string;
  // status?: string; // Future: e.g., 'draft', 'published'
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Represents a full blog post, including content.
 */
export interface BlogPostFull extends BlogPostSummary {
  content: string; // MDX content
  images?: string[]; // Array of image URLs/paths
}

/**
 * Represents the structure of the API response for a list of blog posts.
 */
export interface BlogPostsApiResponse {
  status: string;
  message?: string;
  data: BlogPostSummary[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * Represents the structure of the API response for a single blog post.
 */
export interface BlogPostApiResponse {
  status: string;
  message?: string;
  data: BlogPostFull | null;
}
