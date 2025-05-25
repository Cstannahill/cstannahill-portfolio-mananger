/**
 * @file Custom hook to update an existing blog post using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogPostListKeys, blogPostDetailKeys } from "../queryKeys";
import { updateBlogPost } from "../api/blog";
import type { BlogPost, BlogPostFormInput } from "../../types/blog";
import type { MutationApiResponse, ApiError } from "../../types/api";

interface UpdateBlogPostVariables {
  slugOrId: string;
  data: Partial<BlogPostFormInput>;
}

/**
 * Custom hook to update an existing blog post.
 * @returns {import('@tanstack/react-query').UseMutationResult<MutationApiResponse<BlogPost>, ApiError, UpdateBlogPostVariables, unknown>} The result of the mutation.
 */
export const useUpdateBlogPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    MutationApiResponse<BlogPost>,
    ApiError,
    UpdateBlogPostVariables
  >({
    mutationFn: ({ slugOrId, data }) => updateBlogPost(slugOrId, data),
    onSuccess: (response, variables) => {
      // Invalidate all blog post lists
      queryClient.invalidateQueries({ queryKey: blogPostListKeys() });
      // Invalidate the specific blog post detail query
      queryClient.invalidateQueries({
        queryKey: blogPostDetailKeys(variables.slugOrId),
      });

      // Optionally, update the cache directly if the API returns the updated post
      if (response.data) {
        queryClient.setQueryData(blogPostDetailKeys(variables.slugOrId), {
          data: response.data,
        });
      }
    },
    // onError: (error, variables) => {
    //   // Handle error, e.g., show a notification
    //   console.error(`Failed to update blog post ${variables.slugOrId}:`, error.message);
    // },
  });
};
