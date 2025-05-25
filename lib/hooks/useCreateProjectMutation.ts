/**
 * @file Custom React Query hook for creating a new project.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { queryKeys, projectListKeys, projectDetailKeys } from "@/lib/queryKeys";
import { createProject } from "@/lib/api/projects";
import type { Project, ProjectFormInput } from "@/types/project";
import type { SingleItemApiResponse } from "@/types/api";
import type { ApiError } from "@/types/api";

/**
 * Custom hook for creating a new project.
 *
 * @param {Omit<UseMutationOptions<SingleItemApiResponse<Project>, ApiError, ProjectFormInput>, 'mutationFn'>} [options] - Optional React Query mutation options.
 * @returns {UseMutationResult<SingleItemApiResponse<Project>, ApiError, ProjectFormInput>} The result of the mutation.
 */
export const useCreateProjectMutation = (
  options?: Omit<
    UseMutationOptions<
      SingleItemApiResponse<Project>,
      ApiError,
      ProjectFormInput
    >,
    "mutationFn" // Exclude mutationFn as it's provided by the hook
  >
): UseMutationResult<
  SingleItemApiResponse<Project>,
  ApiError,
  ProjectFormInput
> => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleItemApiResponse<Project>,
    ApiError,
    ProjectFormInput
  >({
    mutationFn: createProject,
    onSuccess: (data, variables, context) => {
      // Invalidate project lists to refetch and show the new project.
      queryClient.invalidateQueries({ queryKey: projectListKeys() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects }); // Invalidate broader project queries

      // Optionally, directly set the data for the new project's detail query if response contains the full project
      if (data.data?._id) {
        queryClient.setQueryData(projectDetailKeys(data.data._id), data);
      }

      // Call user-provided onSuccess if it exists
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Log error or show notification
      console.error("Error creating project:", error);
      // Call user-provided onError if it exists
      options?.onError?.(error, variables, context);
    },
    ...options, // Spread the rest of the user-provided options
  });
};
