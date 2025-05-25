/**
 * @file Custom hook to fetch a single blog post by slug or ID using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import { useQuery } from "@tanstack/react-query";
import { blogPostDetailKeys } from "../queryKeys";
import { fetchBlogPostBySlugOrId } from "../api/blog";
import type { BlogPost } from "../../types/blog";
import type { SingleItemApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to fetch a single blog post.
 * @param {string} slugOrId - The slug or ID of the blog post.
 * @param {object} [options] - Optional TanStack Query options.
 * @param {boolean} [options.enabled] - Whether the query should be enabled.
 * @returns {import('@tanstack/react-query').UseQueryResult<SingleItemApiResponse<BlogPost>, ApiError>} The result of the query.
 */
export const useBlogPostQuery = (
  slugOrId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<
    SingleItemApiResponse<BlogPost>,
    ApiError,
    SingleItemApiResponse<BlogPost>,
    readonly string[]
  >({
    queryKey: blogPostDetailKeys(slugOrId),
    queryFn: () => fetchBlogPostBySlugOrId(slugOrId),
    enabled: options?.enabled !== undefined ? options.enabled : !!slugOrId, // Enabled by default if slugOrId is provided
  });
};
