/**
 * @file Custom hook to fetch the current user's profile using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys, userProfileKeys } from "../queryKeys"; // Changed userKeys to queryKeys and userProfileKeys
import { fetchCurrentUser } from "../api/users";
import type { User } from "../../types/user";
import type { SingleItemApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to fetch the current user's profile.
 * @returns {import('@tanstack/react-query').UseQueryResult<SingleItemApiResponse<User>, ApiError>} The result of the query.
 */
export const useUserQuery = <
  TData = SingleItemApiResponse<User>,
  TError = ApiError,
>(
  options?: Omit<
    UseQueryOptions<
      SingleItemApiResponse<User>,
      TError,
      TData,
      readonly string[]
    >,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TData, TError> => {
  return useQuery<
    SingleItemApiResponse<User>,
    TError,
    TData,
    readonly string[]
  >({
    queryKey: userProfileKeys(),
    queryFn: fetchCurrentUser,
    ...options,
  });
};
