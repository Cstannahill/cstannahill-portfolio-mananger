/**
 * @file Common API response and error types.
 * @version 1.0.0
 * @since 2024-05-25
 */

/**
 * Represents a generic API error structure.
 * @interface ApiError
 * @property {string} message - The error message.
 * @property {string} [errorCode] - An optional application-specific error code.
 * @property {Record<string, any>} [details] - Optional additional error details.
 */
export interface ApiError {
  message: string;
  errorCode?: string;
  details?: Record<string, any>;
}

/**
 * Represents a generic successful API response structure for paginated lists.
 * @template T - The type of the data items in the list.
 * @interface PaginatedApiResponse
 * @property {T[]} data - The array of data items.
 * @property {number} total - The total number of items available.
 * @property {number} page - The current page number.
 * @property {number} limit - The number of items per page.
 * @property {number} [totalPages] - The total number of pages.
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/**
 * Represents a generic successful API response for a single item.
 * @template T - The type of the data item.
 * @interface SingleItemApiResponse
 * @property {T} data - The data item.
 */
export interface SingleItemApiResponse<T> {
  data: T;
}

/**
 * Represents a generic API response for mutation operations (create, update, delete).
 * @template T - The type of the data returned after mutation (optional).
 * @interface MutationApiResponse
 * @property {string} message - A success message.
 * @property {T} [data] - Optional data returned after the mutation.
 */
export interface MutationApiResponse<T = undefined> {
  message: string;
  data?: T;
}
