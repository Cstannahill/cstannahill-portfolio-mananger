/**
 * @file Custom React Query hook to fetch a list of projects.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { projectListKeys } from "@/lib/queryKeys";
import { fetchProjects } from "@/lib/api/projects";
import type { Project, ProjectFilters } from "@/types/project";
import type { PaginatedApiResponse } from "@/types/api";
import type { ApiError } from "@/types/api";

/**
 * Custom hook to fetch a list of projects.
 *
 * @param {ProjectFilters} [filters={}] - Optional filters to apply to the query.
 * @param {Omit<UseQueryOptions<PaginatedApiResponse<Project>, ApiError, PaginatedApiResponse<Project>, ReturnType<typeof projectListKeys>>, 'queryKey' | 'queryFn'>} [options] - Optional React Query options.
 * @returns {UseQueryResult<PaginatedApiResponse<Project>, ApiError>} The result of the query.
 */
export const useProjectsQuery = (
  filters: ProjectFilters = {},
  options?: Omit<
    UseQueryOptions<
      PaginatedApiResponse<Project>,
      ApiError,
      PaginatedApiResponse<Project>,
      ReturnType<typeof projectListKeys> // QueryKey type
    >,
    "queryKey" | "queryFn" // Exclude queryKey and queryFn as they are provided by the hook
  >
): UseQueryResult<PaginatedApiResponse<Project>, ApiError> => {
  return useQuery<
    PaginatedApiResponse<Project>,
    ApiError,
    PaginatedApiResponse<Project>,
    ReturnType<typeof projectListKeys> // Use ReturnType for better type safety
  >({
    queryKey: projectListKeys(filters), // Pass the whole filters object
    queryFn: () => fetchProjects(filters),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
