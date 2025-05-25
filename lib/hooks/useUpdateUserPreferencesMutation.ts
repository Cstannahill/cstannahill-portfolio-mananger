/**
 * @file Custom hook to update user preferences using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { queryKeys, userProfileKeys } from "../queryKeys"; // Changed userKeys to queryKeys and userProfileKeys
import { updateUserPreferences } from "../api/users";
import type {
  UserPreferences,
  UserPreferencesFormInput,
} from "../../types/user";
import type { MutationApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to update user preferences.
 * @returns {import('@tanstack/react-query').UseMutationResult<MutationApiResponse<UserPreferences>, ApiError, UserPreferencesFormInput, unknown>} The result of the mutation.
 */
export const useUpdateUserPreferencesMutation = (
  options?: Omit<
    UseMutationOptions<
      MutationApiResponse<UserPreferences>,
      ApiError,
      UserPreferencesFormInput
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    MutationApiResponse<UserPreferences>,
    ApiError,
    UserPreferencesFormInput
  >({
    mutationFn: updateUserPreferences,
    onSuccess: (data, variables, context) => {
      // Invalidate user preferences and general user queries
      queryClient.invalidateQueries({ queryKey: userProfileKeys() }); // Assuming preferences are part of general user profile or a specific key for them
      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      // Call user-provided onSuccess if it exists
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("Failed to update user preferences:", error.message);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
