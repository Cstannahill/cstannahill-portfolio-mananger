import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Project from "@/models/Project";

// GET a single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database");
    const { slug } = await params;
    console.log("Fetching project with slug:", slug);
    const project = await Project.findOne({ slug });
    console.log("Project fetched:", project);
    if (!project) {
      return NextResponse.json(
        {
          status: "error",
          message: `Project with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      status: "success",
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch project",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const data = await request.json();
    const project = await Project.findOne({ slug });
    if (!project) {
      return NextResponse.json(
        {
          status: "error",
          message: `Project with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }
    // Prevent slug change if new slug already exists
    if (data.slug && data.slug !== slug) {
      const existingProject = await Project.findOne({ slug: data.slug });
      if (existingProject) {
        return NextResponse.json(
          {
            status: "error",
            message: `A project with slug '${data.slug}' already exists`,
          },
          { status: 400 }
        );
      }
    }
    // Update updatedAt timestamp
    data.updatedAt = new Date();
    // Update the project
    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true, runValidators: true }
    );
    return NextResponse.json({
      status: "success",
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    if ((error as any).code === 11000) {
      return NextResponse.json(
        {
          status: "error",
          message: "A project with this slug already exists",
          error: "Duplicate slug",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update project",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const project = await Project.findOneAndDelete({ slug });
    if (!project) {
      return NextResponse.json(
        {
          status: "error",
          message: `Project with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      status: "success",
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete project",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
