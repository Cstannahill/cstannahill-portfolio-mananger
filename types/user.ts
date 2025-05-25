/**
 * @file User-related types and interfaces.
 * @version 1.0.0
 * @since 2024-05-25
 */

/**
 * Represents the structure of a user object.
 * This should align with your User model in the backend.
 * @interface User
 * @property {string} _id - The unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {boolean} emailVerified - Whether the user's email has been verified.
 * @property {string} [image] - URL to the user's profile image.
 * @property {'user' | 'admin'} role - The role of the user.
 * @property {string} createdAt - ISO string for creation timestamp.
 * @property {string} updatedAt - ISO string for last update timestamp.
 * @property {UserPreferences} [preferences] - User-specific preferences.
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified?: boolean | null;
  image?: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
  // Add any other fields that your User model might have
  // e.g., provider, lastLogin, etc.
}

/**
 * Represents user-specific preferences.
 * This could include UI settings, notification preferences, AI settings, etc.
 * @interface UserPreferences
 * @property {string} [theme] - Preferred UI theme (e.g., 'light', 'dark', 'system').
 * @property {boolean} [notificationsEnabled] - Whether notifications are enabled.
 * @property {AISettings} [ai] - AI-specific settings for the user.
 * // Add other preference fields as needed
 */
export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  notificationsEnabled?: boolean;
  ai?: AISettings; // Defined in types/ai-settings.ts or could be nested here
  // Example: dashboardLayout?: 'compact' | 'spacious';
}

/**
 * Represents the data structure for updating a user's profile information.
 * Typically used in forms and API request payloads for profile updates.
 * @interface UserProfileFormInput
 * @property {string} [name] - The user's name.
 * @property {string} [image] - URL to the user's new profile image.
 * // Other fields that a user can update on their profile
 */
export interface UserProfileFormInput {
  name?: string;
  email?: string; // If email change is allowed and requires verification
  image?: string;
  // password?: string; // Typically handled in a separate form/endpoint
}

/**
 * Represents the data structure for updating user preferences.
 * @interface UserPreferencesFormInput
 */
export type UserPreferencesFormInput = Partial<UserPreferences>;

// Assuming AISettings might be defined in its own file or here if simple enough
// If AISettings is complex, it should be in `types/ai-settings.ts` and imported.
/**
 * Represents AI-specific settings for a user.
 * @interface AISettings
 * @property {string} [preferredModel] - The user's preferred AI model.
 * @property {number} [temperature] - Default temperature for AI generation.
 * @property {boolean} [aiSuggestionsEnabled] - Whether AI suggestions are enabled.
 */
export interface AISettings {
  preferredModel?: string;
  temperature?: number;
  aiSuggestionsEnabled?: boolean;
  // Add other AI-related settings
}
