/**
 * @file Custom hook to fetch a list of blog posts using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import { useQuery } from "@tanstack/react-query";
import { blogPostListKeys } from "../queryKeys";
import { fetchBlogPosts } from "../api/blog";
import type { BlogPost, BlogFilters } from "../../types/blog";
import type { PaginatedApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to fetch a list of blog posts.
 * @param {BlogFilters} [filters] - Optional filters for querying blog posts.
 * @returns {import('@tanstack/react-query').UseQueryResult<PaginatedApiResponse<BlogPost>, ApiError>} The result of the query.
 */
export const useBlogPostsQuery = (filters?: BlogFilters) => {
  return useQuery<
    PaginatedApiResponse<BlogPost>,
    ApiError,
    PaginatedApiResponse<BlogPost>,
    readonly (string | { authorId?: string; tags?: string[] } | undefined)[]
  >({
    queryKey: blogPostListKeys(filters),
    queryFn: () => fetchBlogPosts(filters),
    enabled: true, // Adjust as needed, e.g., disable if filters are not ready
  });
};
