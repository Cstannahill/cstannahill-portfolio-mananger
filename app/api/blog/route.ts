import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import BlogPost from "@/models/BlogPost";
import { ApiResponseSuccess, ApiResponseError } from "@/lib/api/response";

// GET all blog posts
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    // const status = searchParams.get("status"); // TODO: Add status to BlogPost model if needed
    const limit = Number(searchParams.get("limit") || "10");
    const page = Number(searchParams.get("page") || "1");

    // Build query object
    const query: any = {};
    if (tag) {
      // Assuming 'tags' in BlogPost model is an array of strings or ObjectIds that can be matched.
      // If 'tags' are ObjectIds, you might need to find the Tag ObjectId first.
      // For simplicity, assuming 'tags' is an array of strings or can be queried directly.
      query.tags = tag; // This might need adjustment based on how tags are stored/queried
    }
    // if (status) query.status = status; // TODO: Add status to BlogPost model

    // Execute query
    const skip = (page - 1) * limit;
    const totalPosts = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("tags"); // Assuming 'tags' is a ref to the Tag model

    return ApiResponseSuccess(
      {
        posts,
        pagination: {
          total: totalPosts,
          page,
          limit,
          pages: Math.ceil(totalPosts / limit),
        },
      },
      200,
      "Blog posts fetched successfully."
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return ApiResponseError(
      "Failed to fetch blog posts",
      500,
      "FETCH_BLOG_POSTS_ERROR",
      (error as Error).message
    );
  }
}

// POST a new blog post
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const data = await request.json();

    // Validate required fields (adjust based on your BlogPost model)
    const requiredFields: (keyof typeof data)[] = [
      "title",
      "excerpt",
      "content",
      "publishedAt",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return ApiResponseError(
          `Missing required field: ${String(field)}`,
          400,
          "VALIDATION_ERROR"
        );
      }
    }

    // More specific validation can be added here using Zod or similar

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^\w-]+/g, "") // Remove non-word characters (except hyphens)
        .replace(/--+/g, "-") // Replace multiple hyphens with a single one
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    }

    // Ensure slug uniqueness before creating (optional, but good practice)
    const existingPostBySlug = await BlogPost.findOne({ slug: data.slug });
    if (existingPostBySlug) {
      return ApiResponseError(
        "A blog post with this slug already exists. Please use a unique slug.",
        409, // Conflict
        "DUPLICATE_SLUG"
      );
    }

    // Create new blog post
    // Ensure 'tags' are handled correctly (e.g., if they are ObjectIds, they need to be valid)
    // For now, assuming data.tags is an array of valid ObjectIds or will be processed by Mongoose
    const newBlogPost = new BlogPost(data);
    const savedBlogPost = await newBlogPost.save();

    // Optionally populate tags if needed in the response
    // const populatedBlogPost = await BlogPost.findById(savedBlogPost._id).populate('tags');

    return ApiResponseSuccess(
      savedBlogPost, // or populatedBlogPost
      201,
      "Blog post created successfully."
    );
  } catch (error: any) {
    console.error("Error creating blog post:", error);

    if (
      error.code === 11000 ||
      error.message?.includes("duplicate key error")
    ) {
      // More specific check for duplicate slug, if the above pre-check wasn't sufficient or for other unique fields
      return ApiResponseError(
        "A blog post with this slug or another unique identifier already exists.",
        409, // Conflict
        "DUPLICATE_KEY_ERROR",
        error.message
      );
    }

    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return ApiResponseError(
        "Validation failed.",
        400,
        "VALIDATION_ERROR",
        messages.join(", ")
      );
    }

    return ApiResponseError(
      "Failed to create blog post",
      500,
      "CREATE_BLOG_POST_ERROR",
      error.message
    );
  }
}
