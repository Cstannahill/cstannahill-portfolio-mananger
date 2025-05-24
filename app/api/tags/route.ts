import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongodb";
import Tag from "@/models/Tag";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";

const TagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.string().nullable().optional(),
});

export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find().sort({ name: 1 });
    return ApiResponseSuccess(tags, 200, "Tags fetched successfully");
  } catch (error) {
    console.error("Error fetching tags:", error);
    return ApiResponseError(
      "Failed to fetch tags",
      500,
      "TAG_FETCH_ERROR",
      (error as Error).message
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = TagSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponseError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        parsed.error.flatten()
      );
    }
    const { name, color } = parsed.data;
    // Check for existing tag
    const existing = await Tag.findOne({ name });
    if (existing) {
      return ApiResponseError("Tag already exists", 409, "DUPLICATE_TAG_ERROR");
    }
    const tag = await Tag.create({ name, color: color ?? null });
    return ApiResponseSuccess(tag, 201, "Tag created successfully");
  } catch (error) {
    console.error("Error creating tag:", error);
    return ApiResponseError(
      "Failed to create tag",
      500,
      "TAG_CREATE_ERROR",
      (error as Error).message
    );
  }
}
