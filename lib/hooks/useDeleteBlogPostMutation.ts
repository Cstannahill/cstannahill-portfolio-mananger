/**
 * @file Custom hook to delete a blog post using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogPostListKeys, blogPostDetailKeys } from "../queryKeys";
import { deleteBlogPost } from "../api/blog";
import type { MutationApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to delete a blog post.
 * @returns {import('@tanstack/react-query').UseMutationResult<MutationApiResponse<null>, ApiError, string, unknown>} The result of the mutation.
 */
export const useDeleteBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<MutationApiResponse<null>, ApiError, string>({
    mutationFn: deleteBlogPost, // Takes slugOrId as argument
    onSuccess: (data, slugOrId) => {
      // Invalidate all blog post lists
      queryClient.invalidateQueries({ queryKey: blogPostListKeys() });
      // Remove the deleted post from the cache for its detail query
      queryClient.removeQueries({ queryKey: blogPostDetailKeys(slugOrId) });
      // Optionally, navigate away or show a success message
    },
    // onError: (error, slugOrId) => {
    //   // Handle error, e.g., show a notification
    //   console.error(`Failed to delete blog post ${slugOrId}:`, error.message);
    // },
  });
};
