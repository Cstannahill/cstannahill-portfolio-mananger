import type { User } from "./user"; // Added
import type { Tag, BlogTag } from "./tag"; // Updated import to BlogTag and added Tag

/**
 * @typescript Rule - Strict Explicit Typing:
 * All object properties must be explicitly typed via interfaces or type aliases.
 */

/**
 * Represents the summary of a blog post, typically used in lists.
 */
export interface BlogPostSummary {
  _id: string; // Changed from _id to id for consistency
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: User; // Added author
  publishedAt: string; // Or Date
  tags: Tag[]; // Changed to Tag[] for consistency
  status?: "draft" | "published" | "archived"; // Added status
  views?: number; // Added views
  readingTime?: string; // Added readingTime
  createdAt?: string; // Added createdAt
  updatedAt?: string; // Added updatedAt
}

/**
 * Represents a full blog post, including content.
 */
export interface BlogPostFull extends BlogPostSummary {
  content: string; // Markdown content
  // Potentially more detailed fields like author, related posts, etc.
  images?: string[]; // Array of image URLs or paths
}

/**
 * @deprecated Use specific response types like BlogPostsApiResponseData or BlogPostApiResponseData
 */
export interface BlogPostApiResponse {
  status: "success" | "error";
  data?: any; // Keeping as any for backward compatibility during refactor, should be T
  message?: string;
  error?: any;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface BlogPostsApiResponseData {
  posts: BlogPostSummary[];
  pagination: PaginationInfo;
}

export interface BlogPostApiResponseData {
  post: BlogPostFull;
}

// Specific response structure for GET /api/blog (list of posts)
export interface GetBlogPostsResponse {
  status: "success" | "error";
  data?: BlogPostsApiResponseData;
  message?: string;
  error?: any;
}

// Specific response structure for GET /api/blog/[slug] (single post)
export interface GetBlogPostResponse {
  status: "success" | "error";
  data?: BlogPostFull; // Direct data, not nested under 'post'
  message?: string;
  error?: any;
}

/**
 * @file Type definitions for Blog-related entities and forms.
 * @version 1.0.0
 * @since 2024-05-25
 */

/**
 * Represents the structure of a blog post (consolidated and refined).
 */
export interface BlogPost extends BlogPostFull {
  // All fields from BlogPostFull are inherited
  // Additional specific fields for a canonical BlogPost object if any
}

/**
 * Represents the input for creating or updating a blog post.
 */
export interface BlogPostFormInput {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string; // Assuming we send authorId
  tagIds?: string[]; // Assuming we send tagIds
  status: "draft" | "published" | "archived";
  publishedAt?: string | null; // ISO date string
}

/**
 * Represents available filters for querying blog posts.
 */
export interface BlogFilters {
  authorId?: string;
  tagIds?: string[];
  status?: "draft" | "published" | "archived";
  search?: string;
  sortBy?: "publishedAt" | "createdAt" | "views" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
