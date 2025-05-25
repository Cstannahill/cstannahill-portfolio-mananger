/**
 * @file Custom React Query hook for updating an existing project.
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
import { updateProject } from "@/lib/api/projects";
import type { Project, ProjectFormInput } from "@/types/project";
import type { SingleItemApiResponse } from "@/types/api";
import type { ApiError } from "@/types/api";

interface UpdateProjectVariables {
  projectId: string;
  payload: Partial<ProjectFormInput>;
}

/**
 * Custom hook for updating an existing project.
 *
 * @param {Omit<UseMutationOptions<SingleItemApiResponse<Project>, ApiError, UpdateProjectVariables>, 'mutationFn'>} [options] - Optional React Query mutation options.
 * @returns {UseMutationResult<SingleItemApiResponse<Project>, ApiError, UpdateProjectVariables>} The result of the mutation.
 */
export const useUpdateProjectMutation = (
  options?: Omit<
    UseMutationOptions<
      SingleItemApiResponse<Project>,
      ApiError,
      UpdateProjectVariables
    >,
    "mutationFn"
  >
): UseMutationResult<
  SingleItemApiResponse<Project>,
  ApiError,
  UpdateProjectVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleItemApiResponse<Project>,
    ApiError,
    UpdateProjectVariables
  >({
    mutationFn: async ({ projectId, payload }: UpdateProjectVariables) =>
      updateProject(projectId, payload),
    onSuccess: (data, variables, context) => {
      // Invalidate project lists and the specific project's details
      queryClient.invalidateQueries({ queryKey: projectListKeys() });
      queryClient.invalidateQueries({
        queryKey: projectDetailKeys(variables.projectId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects }); // Invalidate broader project queries

      // Optionally, update the specific project's query data directly
      if (data.data?._id) {
        queryClient.setQueryData(projectDetailKeys(data.data._id), data);
      }

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error(`Error updating project ${variables.projectId}:`, error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
