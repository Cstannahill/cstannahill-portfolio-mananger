/**
 * @file Custom hook to fetch user preferences using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys, userProfileKeys } from "../queryKeys"; // Changed userKeys to queryKeys and userProfileKeys
import { fetchUserPreferences } from "../api/users";
import type { UserPreferences } from "../../types/user";
import type { SingleItemApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to fetch user preferences.
 * @returns {import('@tanstack/react-query').UseQueryResult<SingleItemApiResponse<UserPreferences>, ApiError>} The result of the query.
 */
export const useUserPreferencesQuery = () => {
  return useQuery<
    SingleItemApiResponse<UserPreferences>,
    ApiError,
    SingleItemApiResponse<UserPreferences>,
    readonly [string, string]
  >({
    queryKey: userProfileKeys(), // Or a more specific key for preferences if defined
    queryFn: fetchUserPreferences,
  });
};
