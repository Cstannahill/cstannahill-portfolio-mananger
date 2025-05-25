/**
 * @file Custom hook to update the current user's profile using TanStack Query.
 * @version 1.0.0
 * @since 2024-05-25
 */
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { queryKeys, userProfileKeys } from "../queryKeys"; // Changed userKeys to queryKeys and userProfileKeys
import { updateUserProfile } from "../api/users";
import type { User, UserProfileFormInput } from "../../types/user";
import type { MutationApiResponse, ApiError } from "../../types/api";

/**
 * Custom hook to update the current user's profile.
 * @returns {import('@tanstack/react-query').UseMutationResult<MutationApiResponse<User>, ApiError, UserProfileFormInput, unknown>} The result of the mutation.
 */
export const useUpdateUserMutation = (
  options?: Omit<
    UseMutationOptions<
      MutationApiResponse<User>,
      ApiError,
      UserProfileFormInput
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<MutationApiResponse<User>, ApiError, UserProfileFormInput>(
    {
      mutationFn: updateUserProfile,
      onSuccess: (data, variables, context) => {
        // Invalidate the user profile query to refetch the updated data
        queryClient.invalidateQueries({ queryKey: userProfileKeys() });
        queryClient.invalidateQueries({ queryKey: queryKeys.user }); // Broader user data

        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        console.error("Failed to update user profile:", error.message);
        options?.onError?.(error, variables, context);
      },
      ...options,
    }
  );
};
