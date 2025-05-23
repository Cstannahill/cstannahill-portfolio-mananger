import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";

export async function GET() {
  try {
    // Test database connection
    const mongoose = await connectToDatabase();

    return NextResponse.json({
      status: "success",
      message: "MongoDB connection successful",
      timestamp: new Date().toISOString(),
      databaseConnected: mongoose.connection.readyState === 1,
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to MongoDB",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
