/**
 * @file Custom hook to create a new blog post using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogPostListKeys, blogPostDetailKeys } from "../queryKeys";
import { createBlogPost } from "../api/blog";
import type { BlogPost, BlogPostFormInput } from "../../types/blog";
import type { MutationApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to create a new blog post.
 * @returns {import('@tanstack/react-query').UseMutationResult<MutationApiResponse<BlogPost>, ApiError, BlogPostFormInput, unknown>} The result of the mutation.
 */
export const useCreateBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    MutationApiResponse<BlogPost>,
    ApiError,
    BlogPostFormInput
  >({
    mutationFn: createBlogPost,
    onSuccess: (data) => {
      // Invalidate and refetch all blog post lists
      queryClient.invalidateQueries({ queryKey: blogPostListKeys() });
      // If the new post data is returned, we can also update the cache for its detail query
      if (data.data?.slug) {
        queryClient.setQueryData(blogPostDetailKeys(data.data.slug), {
          data: data.data,
        });
      }
      // Optionally, navigate to the new post or show a success message
    },
    // onError: (error) => {
    //   // Handle error, e.g., show a notification
    //   console.error('Failed to create blog post:', error.message);
    // },
  });
};
