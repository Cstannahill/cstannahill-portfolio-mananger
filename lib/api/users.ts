/**
 * @file API functions for user-related operations.
 * @version 1.0.0
 * @since 2024-05-25
 */
import type {
  User,
  UserProfileFormInput,
  UserPreferences,
  UserPreferencesFormInput,
} from "../../types/user";
import type {
  ApiError,
  SingleItemApiResponse,
  MutationApiResponse,
} from "../../types/api";

const API_BASE_URL = "/api";

/**
 * Fetches the current user's profile.
 * @returns {Promise<SingleItemApiResponse<User>>} The user's profile.
 * @throws {ApiError} If the request fails.
 */
export const fetchCurrentUser = async (): Promise<
  SingleItemApiResponse<User>
> => {
  const response = await fetch(`${API_BASE_URL}/user/profile`);
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to fetch user profile");
  }
  return response.json() as Promise<SingleItemApiResponse<User>>;
};

/**
 * Updates the current user's profile.
 * @param {UserProfileFormInput} data - The user profile data to update.
 * @returns {Promise<MutationApiResponse<User>>} The updated user profile.
 * @throws {ApiError} If the request fails.
 */
export const updateUserProfile = async (
  data: UserProfileFormInput
): Promise<MutationApiResponse<User>> => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to update user profile");
  }
  return response.json() as Promise<MutationApiResponse<User>>;
};

/**
 * Fetches the current user's preferences.
 * @returns {Promise<SingleItemApiResponse<UserPreferences>>} The user's preferences.
 * @throws {ApiError} If the request fails.
 */
export const fetchUserPreferences = async (): Promise<
  SingleItemApiResponse<UserPreferences>
> => {
  const response = await fetch(`${API_BASE_URL}/user/preferences`);
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to fetch user preferences");
  }
  return response.json() as Promise<SingleItemApiResponse<UserPreferences>>;
};

/**
 * Updates the current user's preferences.
 * @param {UserPreferencesFormInput} data - The user preferences data to update.
 * @returns {Promise<MutationApiResponse<UserPreferences>>} The updated user preferences.
 * @throws {ApiError} If the request fails.
 */
export const updateUserPreferences = async (
  data: UserPreferencesFormInput
): Promise<MutationApiResponse<UserPreferences>> => {
  const response = await fetch(`${API_BASE_URL}/user/preferences`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to update user preferences");
  }
  return response.json() as Promise<MutationApiResponse<UserPreferences>>;
};
