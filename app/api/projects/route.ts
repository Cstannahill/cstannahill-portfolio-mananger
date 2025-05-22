import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Project from "@/models/Project";
import { z } from "zod";

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

    const projects = await Project.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      status: "success",
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch projects",
        error: (error as Error).message,
      },
      { status: 500 }
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
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
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
    return NextResponse.json(
      {
        status: "success",
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create project",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
