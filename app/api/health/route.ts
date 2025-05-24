import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";

export async function GET(): Promise<NextResponse> {
  try {
    // Test database connection
    const mongoose = await connectToDatabase();

    return ApiResponseSuccess(
      {
        timestamp: new Date().toISOString(),
        databaseConnected: mongoose.connection.readyState === 1,
      },
      200,
      "MongoDB connection successful"
    );
  } catch (error) {
    console.error("Error connecting to database:", error);
    return ApiResponseError(
      "Failed to connect to MongoDB",
      500,
      "DB_CONNECTION_ERROR",
      (error as Error).message
    );
  }
}
