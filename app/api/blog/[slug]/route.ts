import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import BlogPost from "@/models/BlogPost";

// GET a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const post = await BlogPost.findOne({ slug });

    if (!post) {
      return NextResponse.json(
        {
          status: "error",
          message: `Blog post with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch blog post",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const data = await request.json();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug });

    if (!post) {
      return NextResponse.json(
        {
          status: "error",
          message: `Blog post with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    // Prevent slug change if new slug already exists
    if (data.slug && data.slug !== slug) {
      const existingPost = await BlogPost.findOne({ slug: data.slug });
      if (existingPost) {
        return NextResponse.json(
          {
            status: "error",
            message: `A blog post with slug '${data.slug}' already exists`,
          },
          { status: 400 }
        );
      }
    }

    // Update updatedAt timestamp
    data.updatedAt = new Date();

    // Update the blog post
    const updatedPost = await BlogPost.findOneAndUpdate(
      { slug: slug },
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      status: "success",
      message: "Blog post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);

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
        message: "Failed to update blog post",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const post = await BlogPost.findOneAndDelete({ slug });

    if (!post) {
      return NextResponse.json(
        {
          status: "error",
          message: `Blog post with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete blog post",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
