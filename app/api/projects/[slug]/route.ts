import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb"; // Corrected import path
import Project, { IProject } from "@/models/Project"; // Import IProject if ProjectSchema is not directly exported
import { z } from "zod";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";

// Zod schema for validating project data on update. Corresponds to IProject.
// Ensure this schema is comprehensive and matches your Mongoose schema structure.
const ZodProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"), // Slug is part of the model, but we prevent its update via PUT
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  technologies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  publishedAt: z.coerce.date().optional(), // coerce to date if string
  // updatedAt: z.date().optional(), // This will be set by the server
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  metadata: z.record(z.any()).optional(), // For flexible metadata
});

// Zod schema for updating a project (allows partial updates, omits slug for update)
const UpdateProjectSchema = ZodProjectSchema.partial().omit({ slug: true });

interface RouteParams {
  slug: string;
}

// GET a single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
): Promise<NextResponse> {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database");
    const { slug } = await params;
    console.log("Fetching project with slug:", slug);
    const project = await Project.findOne({ slug });
    console.log("Project fetched:", project);
    if (!project) {
      return ApiResponseError(
        `Project with slug '${slug}' not found`,
        404,
        "NOT_FOUND"
      );
    }
    return ApiResponseSuccess(project, 200, "Project fetched successfully");
  } catch (error) {
    console.error("Error fetching project:", error);
    return ApiResponseError(
      "Failed to fetch project",
      500,
      "PROJECT_FETCH_ERROR",
      (error as Error).message
    );
  }
}

// Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!slug) {
    return ApiResponseError("Project slug is required", 400, "MISSING_SLUG");
  }

  try {
    await connectToDatabase();

    const body = await request.json();
    const validationResult = UpdateProjectSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponseError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        validationResult.error.flatten().fieldErrors
      );
    }

    const updateData = { ...validationResult.data, updatedAt: new Date() }; // Add updatedAt timestamp

    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return ApiResponseError("Project not found", 404, "NOT_FOUND");
    }

    return ApiResponseSuccess(
      updatedProject,
      200,
      "Project updated successfully"
    );
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof z.ZodError) {
      return ApiResponseError(
        "Validation error during processing",
        400,
        "VALIDATION_ERROR",
        error.flatten().fieldErrors
      );
    }
    // Handle Mongoose duplicate key error (code 11000)
    if ((error as any).code === 11000) {
      return ApiResponseError(
        `A project with this value already exists.`,
        409,
        "DUPLICATE_KEY_ERROR"
      );
    }
    return ApiResponseError(
      "Internal Server Error",
      500,
      "INTERNAL_SERVER_ERROR",
      (error as Error).message
    );
  }
}

// Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!slug) {
    return ApiResponseError("Project slug is required", 400, "MISSING_SLUG");
  }

  try {
    await connectToDatabase();
    const deletedProject = await Project.findOneAndDelete({ slug });

    if (!deletedProject) {
      return ApiResponseError("Project not found", 404, "NOT_FOUND");
    }

    return ApiResponseSuccess(null, 200, "Project deleted successfully"); // Or 204 No Content
  } catch (error) {
    console.error("Error deleting project:", error);
    return ApiResponseError(
      "Failed to delete project",
      500,
      "PROJECT_DELETE_ERROR",
      (error as Error).message
    );
  }
}

// Needed for Next.js to correctly identify this as a dynamic route handler
export const dynamic = "force-dynamic";
