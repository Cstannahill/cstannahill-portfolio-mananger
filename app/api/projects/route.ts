import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Project from "@/models/Project";
import { z } from "zod";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";

// Zod schema for project creation
const ProjectCreateSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  technologies: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  demoUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  slug: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// GET all projects
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const sortParam = searchParams.get("sort");

    let query = Project.find({});

    // Sorting
    if (sortParam) {
      const [sortField, sortOrder] = sortParam.split(":");
      const sortDirection = sortOrder === "desc" ? -1 : 1;
      if (sortField) {
        query = query.sort({ [sortField]: sortDirection });
      }
    } else {
      // Default sort if not specified
      query = query.sort({ createdAt: -1 });
    }

    // Limiting
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit);
      }
    }

    const projects = await query.exec();

    return ApiResponseSuccess(projects, 200, "Projects fetched successfully");
  } catch (error) {
    console.error("Error fetching projects:", error);
    return ApiResponseError(
      "Failed to fetch projects",
      500,
      "PROJECT_FETCH_ERROR",
      (error as Error).message
    );
  }
}

// POST a new project
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const parseResult = ProjectCreateSchema.safeParse(data);
    if (!parseResult.success) {
      return ApiResponseError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        parseResult.error.flatten()
      );
    }
    const projectData = parseResult.data;
    // Generate slug if not provided
    if (!projectData.slug) {
      projectData.slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    // Set publishedAt if not provided
    if (!projectData.publishedAt) {
      projectData.publishedAt = new Date().toISOString();
    }
    // Create new project
    const project = await Project.create(projectData);
    return ApiResponseSuccess(project, 201, "Project created successfully");
  } catch (error) {
    console.error("Error creating project:", error);
    return ApiResponseError(
      "Failed to create project",
      500,
      "PROJECT_CREATE_ERROR",
      (error as Error).message
    );
  }
}
