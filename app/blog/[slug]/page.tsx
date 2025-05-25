import { notFound } from "next/navigation";
import { format } from "date-fns";
import type { BlogPostFull, GetBlogPostsResponse } from "@/types";
import { MDXLivePreview } from "@/components/MDXLivePreview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPostFull | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: "no-store", // Or use revalidate tags for ISR
    });

    if (res.status === 404) {
      return null; // Post not found
    }

    if (!res.ok) {
      console.error(
        `Error fetching blog post ${slug}: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const jsonResponse: {
      success: boolean;
      data?: BlogPostFull;
      message?: string;
      error?: any;
    } = await res.json();

    if (!jsonResponse.success || !jsonResponse.data) {
      console.error(
        `API response for blog post ${slug} was not successful or data is missing:`,
        jsonResponse.message
      );
      return null;
    }

    return jsonResponse.data;
  } catch (error) {
    console.error(`Network or other error fetching blog post ${slug}:`, error);
    return null;
  }
}

// Generate static params for static generation
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog`);

    if (!res.ok) {
      console.error(
        `Failed to fetch blog posts for static generation: ${res.status}`
      );
      return [];
    }

    // Updated to use GetBlogPostsResponse and access response.data.posts
    const response: GetBlogPostsResponse = await res.json();

    if (
      response.status !== "success" ||
      !response.data ||
      !response.data.posts
    ) {
      console.error(
        "API response was not successful or data.posts is missing:",
        response.message
      );
      return [];
    }

    return response.data.posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Dummy author data - replace with actual data if available
  const author = {
    name: "Site Author",
    avatarUrl: "/images/default-avatar.png", // Provide a default avatar image
  };

  return (
    <article className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          {post.title}
        </h1>
        <div className="mt-6 flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>
              {author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {author.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published on {format(new Date(post.publishedAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
        {post.coverImage && (
          <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {post.excerpt && (
        <p className="mt-2 mb-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          {post.excerpt}
        </p>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
        {/* Ensure MDXLivePreview can handle your MDX content. 
            You might need to pass custom components if your MDX uses them. */}
        <MDXLivePreview mdxSource={post.content} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wider uppercase mb-3">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              // Assuming tags are strings (IDs or names). If they are objects, adjust accordingly.
              // If you have a page for tags, you can link them: <Link href={`/tags/${tag.name}`}>
              <Badge
                key={typeof tag === "string" ? tag : tag._id}
                variant="secondary"
              >
                {typeof tag === "string" ? tag : tag.name}
              </Badge>
              // </Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}

// Optional: Generate metadata dynamically
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || "Read this blog post.",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
      // authors: ['Author Name'], // Add author if available
      // tags: post.tags, // Add tags if available as strings
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}
