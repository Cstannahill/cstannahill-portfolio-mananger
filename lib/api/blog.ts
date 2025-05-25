/**
 * @file API functions for blog-related operations.
 * @version 1.0.0
 * @since 2024-05-25
 */
import type {
  BlogPost,
  BlogPostFormInput,
  BlogFilters,
} from "../../types/blog";
import type {
  ApiError,
  PaginatedApiResponse,
  SingleItemApiResponse,
  MutationApiResponse,
} from "../../types/api";

const API_BASE_URL = "/api";

/**
 * Fetches a list of blog posts.
 * @param {BlogFilters} [filters] - Optional filters for querying blog posts.
 * @returns {Promise<PaginatedApiResponse<BlogPost>>} A paginated list of blog posts.
 * @throws {ApiError} If the request fails.
 */
export const fetchBlogPosts = async (
  filters?: BlogFilters
): Promise<PaginatedApiResponse<BlogPost>> => {
  const queryParams = filters
    ? new URLSearchParams(filters as any).toString()
    : "";
  const response = await fetch(
    `${API_BASE_URL}/blog${queryParams ? `?${queryParams}` : ""}`
  );
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to fetch blog posts");
  }
  return response.json() as Promise<PaginatedApiResponse<BlogPost>>;
};

/**
 * Fetches a single blog post by its slug or ID.
 * @param {string} slugOrId - The slug or ID of the blog post.
 * @returns {Promise<SingleItemApiResponse<BlogPost>>} The blog post.
 * @throws {ApiError} If the request fails.
 */
export const fetchBlogPostBySlugOrId = async (
  slugOrId: string
): Promise<SingleItemApiResponse<BlogPost>> => {
  const response = await fetch(`${API_BASE_URL}/blog/${slugOrId}`);
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(
      errorData.message || `Failed to fetch blog post: ${slugOrId}`
    );
  }
  return response.json() as Promise<SingleItemApiResponse<BlogPost>>;
};

/**
 * Creates a new blog post.
 * @param {BlogPostFormInput} data - The blog post data to create.
 * @returns {Promise<MutationApiResponse<BlogPost>>} The created blog post.
 * @throws {ApiError} If the request fails.
 */
export const createBlogPost = async (
  data: BlogPostFormInput
): Promise<MutationApiResponse<BlogPost>> => {
  const response = await fetch(`${API_BASE_URL}/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to create blog post");
  }
  return response.json() as Promise<MutationApiResponse<BlogPost>>;
};

/**
 * Updates an existing blog post.
 * @param {string} slugOrId - The slug or ID of the blog post to update.
 * @param {Partial<BlogPostFormInput>} data - The blog post data to update.
 * @returns {Promise<MutationApiResponse<BlogPost>>} The updated blog post.
 * @throws {ApiError} If the request fails.
 */
export const updateBlogPost = async (
  slugOrId: string,
  data: Partial<BlogPostFormInput>
): Promise<MutationApiResponse<BlogPost>> => {
  const response = await fetch(`${API_BASE_URL}/blog/${slugOrId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(
      errorData.message || `Failed to update blog post: ${slugOrId}`
    );
  }
  return response.json() as Promise<MutationApiResponse<BlogPost>>;
};

/**
 * Deletes a blog post.
 * @param {string} slugOrId - The slug or ID of the blog post to delete.
 * @returns {Promise<MutationApiResponse<null>>} A confirmation of deletion.
 * @throws {ApiError} If the request fails.
 */
export const deleteBlogPost = async (
  slugOrId: string
): Promise<MutationApiResponse<null>> => {
  const response = await fetch(`${API_BASE_URL}/blog/${slugOrId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(
      errorData.message || `Failed to delete blog post: ${slugOrId}`
    );
  }
  return response.json() as Promise<MutationApiResponse<null>>;
};
