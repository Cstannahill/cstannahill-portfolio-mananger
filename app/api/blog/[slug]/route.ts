import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import BlogPost from "@/models/BlogPost";
import {
  ApiResponseSuccess,
  ApiResponseError,
} from "../../../../lib/api/response"; // Corrected import path

// GET a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const post = await BlogPost.findOne({ slug });

    if (!post) {
      return ApiResponseError(`Blog post with slug '${slug}' not found`, 404);
    }

    return ApiResponseSuccess(post, 200);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return ApiResponseError(
      "Failed to fetch blog post",
      500,
      (error as Error).message
    );
  }
}

// Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const data = await request.json();
    const { slug } = await params; // Original slug from URL
    const post = await BlogPost.findOne({ slug });

    if (!post) {
      return ApiResponseError(
        `Blog post with slug '${slug}' not found to update`,
        404
      );
    }

    // Prevent slug change if new slug (data.slug) already exists and is different from the original slug
    if (data.slug && data.slug !== slug) {
      const existingPostWithNewSlug = await BlogPost.findOne({
        slug: data.slug,
      });
      if (existingPostWithNewSlug) {
        return ApiResponseError(
          `A blog post with the new slug '${data.slug}' already exists. Choose a different slug.`,
          400
        );
      }
    }

    // Update updatedAt timestamp
    data.updatedAt = new Date();

    // Update the blog post
    const updatedPost = await BlogPost.findOneAndUpdate(
      { slug: slug }, // Find by original slug
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      // This case should ideally not be reached if the initial findOne was successful
      // but as a safeguard:
      return ApiResponseError(
        `Failed to update blog post with slug '${slug}'. Post may have been deleted during operation.`,
        404
      );
    }

    return ApiResponseSuccess(updatedPost, 200);
  } catch (error: any) {
    // Explicitly type error
    console.error("Error updating blog post:", error);

    if (
      error.code === 11000 ||
      (error.name === "MongoServerError" && error.code === 11000)
    ) {
      // Handle duplicate key error for the new slug if it was changed
      const newSlug = error.keyValue?.slug;
      return ApiResponseError(
        `A blog post with the slug '${newSlug || "provided"}' already exists. Please choose a unique slug.`,
        400,
        "Duplicate slug"
      );
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return ApiResponseError("Validation failed", 400, errors.join(", "));
    }

    return ApiResponseError(
      "Failed to update blog post",
      500,
      (error as Error).message
    );
  }
}

// Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const post = await BlogPost.findOneAndDelete({ slug });

    if (!post) {
      return ApiResponseError(
        `Blog post with slug '${slug}' not found for deletion`,
        404
      );
    }

    return ApiResponseSuccess(null, 200);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return ApiResponseError(
      "Failed to delete blog post",
      500,
      (error as Error).message
    );
  }
}
