import { NextResponse } from "next/server";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    details?: any;
  };
}

/**
 * Sends a standardized success JSON response.
 * @param data The data payload to send.
 * @param status HTTP status code, defaults to 200.
 * @param message Optional success message.
 * @returns NextResponse object.
 */
export function ApiResponseSuccess<T>(
  data: T,
  status: number = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message: message || "Operation successful",
      data: data,
    },
    { status }
  );
}

/**
 * Sends a standardized error JSON response.
 * @param message Error message.
 * @param status HTTP status code, defaults to 500.
 * @param errorCode Optional error code.
 * @param details Optional additional error details.
 * @returns NextResponse object.
 */
export function ApiResponseError(
  message: string,
  status: number = 500,
  errorCode?: string,
  details?: any
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      message: message,
      error: {
        code: errorCode,
        details: details,
      },
      data: null, // Explicitly set data to null for error responses
    },
    { status }
  );
}
