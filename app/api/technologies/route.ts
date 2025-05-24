import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongodb";
import Technology from "@/models/Technology";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";

const TechnologySchema = z.object({
  name: z.string().min(1, "Technology name is required"),
  color: z.string().nullable().optional(),
});

export async function GET() {
  try {
    await dbConnect();
    const technologies = await Technology.find().sort({ name: 1 });
    return ApiResponseSuccess(
      technologies,
      200,
      "Technologies fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return ApiResponseError(
      "Failed to fetch technologies",
      500,
      "TECH_FETCH_ERROR",
      (error as Error).message
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = TechnologySchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponseError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        parsed.error.flatten()
      );
    }
    const { name, color } = parsed.data;
    // Check for existing technology
    const existing = await Technology.findOne({ name });
    if (existing) {
      return ApiResponseError(
        "Technology already exists",
        409,
        "DUPLICATE_TECH_ERROR"
      );
    }
    const technology = await Technology.create({ name, color: color ?? null });
    return ApiResponseSuccess(
      technology,
      201,
      "Technology created successfully"
    );
  } catch (error) {
    console.error("Error creating technology:", error);
    return ApiResponseError(
      "Failed to create technology",
      500,
      "TECH_CREATE_ERROR",
      (error as Error).message
    );
  }
}
