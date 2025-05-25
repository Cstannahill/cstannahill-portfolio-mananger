/**
 * @file Custom React Query hook to fetch a single project by its ID or slug.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { projectDetailKeys } from "@/lib/queryKeys";
import { fetchProjectByIdentifier } from "@/lib/api/projects";
import type { Project } from "@/types/project";
import type { SingleItemApiResponse } from "@/types/api";
import type { ApiError } from "@/types/api";

/**
 * Custom hook to fetch a single project by its ID or slug.
 *
 * @param {string | undefined} identifier - The ID or slug of the project. The query is disabled if undefined.
 * @param {Omit<UseQueryOptions<SingleItemApiResponse<Project>, ApiError, SingleItemApiResponse<Project>, ReturnType<typeof projectDetailKeys>>, 'queryKey' | 'queryFn' | 'enabled'>} [options] - Optional React Query options.
 * @returns {UseQueryResult<SingleItemApiResponse<Project>, ApiError>} The result of the query.
 */
export const useProjectQuery = (
  identifier: string | undefined,
  options?: Omit<
    UseQueryOptions<
      SingleItemApiResponse<Project>,
      ApiError,
      SingleItemApiResponse<Project>,
      ReturnType<typeof projectDetailKeys> // QueryKey type
    >,
    "queryKey" | "queryFn" | "enabled" // Exclude queryKey, queryFn, and enabled as they are managed by the hook
  >
): UseQueryResult<SingleItemApiResponse<Project>, ApiError> => {
  return useQuery<
    SingleItemApiResponse<Project>,
    ApiError,
    SingleItemApiResponse<Project>,
    ReturnType<typeof projectDetailKeys>
  >({
    queryKey: projectDetailKeys(identifier!),
    queryFn: async () => {
      if (!identifier) {
        // This should ideally not be reached if `enabled` is false, but as a safeguard:
        throw new Error(
          "Project identifier is undefined. Query should be disabled."
        );
      }
      return fetchProjectByIdentifier(identifier);
    },
    enabled: !!identifier, // Only run the query if the identifier is provided
    ...options,
  });
};
