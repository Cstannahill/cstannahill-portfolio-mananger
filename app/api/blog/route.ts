import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import BlogPost from "@/models/BlogPost";

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const status = searchParams.get("status");
    const limit = Number(searchParams.get("limit") || "10");
    const page = Number(searchParams.get("page") || "1");

    // Build query object
    const query: any = {};
    if (tag) query.tags = tag;
    if (status) query.status = status;

    // Execute query
    const skip = (page - 1) * limit;
    const totalPosts = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      status: "success",
      data: posts,
      pagination: {
        total: totalPosts,
        page,
        limit,
        pages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch blog posts",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// POST a new blog post
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.summary || !data.content) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Missing required fields: title, summary, and content are required",
        },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Create new blog post
    const blogPost = await BlogPost.create(data);

    return NextResponse.json(
      {
        status: "success",
        message: "Blog post created successfully",
        data: blogPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);

    // Handle duplicate slug error
    if ((error as any).code === 11000) {
      return NextResponse.json(
        {
          status: "error",
          message: "A blog post with this slug already exists",
          error: "Duplicate slug",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create blog post",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
