/**
 * @file Custom React Query hook for deleting a project.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { queryKeys, projectListKeys, projectDetailKeys } from "@/lib/queryKeys"; // Changed projectKeys to queryKeys
import { deleteProject } from "@/lib/api/projects";
import type { MutationApiResponse } from "@/types/api";
import type { ApiError } from "@/types/api";

interface DeleteProjectVariables {
  projectId: string;
}

/**
 * Custom hook for deleting a project.
 *
 * @param {Omit<UseMutationOptions<MutationApiResponse, ApiError, DeleteProjectVariables>, 'mutationFn'>} [options] - Optional React Query mutation options.
 * @returns {UseMutationResult<MutationApiResponse, ApiError, DeleteProjectVariables>} The result of the mutation.
 */
export const useDeleteProjectMutation = (
  options?: Omit<
    UseMutationOptions<MutationApiResponse, ApiError, DeleteProjectVariables>,
    "mutationFn"
  >
): UseMutationResult<MutationApiResponse, ApiError, DeleteProjectVariables> => {
  const queryClient = useQueryClient();

  return useMutation<MutationApiResponse, ApiError, DeleteProjectVariables>({
    mutationFn: async ({ projectId }: DeleteProjectVariables) =>
      deleteProject(projectId),
    onSuccess: (data, variables, context) => {
      // Invalidate project lists and specific project details
      queryClient.invalidateQueries({ queryKey: projectListKeys() });
      queryClient.invalidateQueries({
        queryKey: projectDetailKeys(variables.projectId),
      }); // Used variables.projectId
      queryClient.invalidateQueries({ queryKey: queryKeys.projects }); // Invalidate broader project queries

      // Call user-provided onSuccess if it exists
      options?.onSuccess?.(data, variables, context); // Used variables
    },
    onError: (error, variables, context) => {
      console.error(`Error deleting project ${variables.projectId}:`, error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
