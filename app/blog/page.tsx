import Link from "next/link";
import { format } from "date-fns";
import type { BlogPostSummary, BlogPostsApiResponse } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getPublishedBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    // Ensure NEXT_PUBLIC_APP_URL is set in your environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog?status=published`, {
      // Assuming your API supports a status filter
      cache: "no-store", // Or use revalidate tags for ISR
    });

    if (!res.ok) {
      console.error(
        `Error fetching blog posts: ${res.status} ${res.statusText}`
      );
      // In a real app, you might throw an error or return a specific error object
      return [];
    }

    const jsonResponse: BlogPostsApiResponse = await res.json();

    if (jsonResponse.status !== "success" || !jsonResponse.data) {
      console.error(
        "API response was not successful or data is missing:",
        jsonResponse.message
      );
      return [];
    }
    return jsonResponse.data;
  } catch (error) {
    console.error("Network or other error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Our Blog
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Insights, news, and updates from our team.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No blog posts published yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              {post.coverImage && (
                <div className="flex-shrink-0 h-48 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-full w-full object-cover"
                    src={post.coverImage}
                    alt={post.title}
                  />
                </div>
              )}
              <CardHeader className="flex-grow">
                <Link href={`/blog/${post.slug}`} className="block mt-2">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                    {post.title}
                  </CardTitle>
                </Link>
                {post.excerpt && (
                  <CardDescription className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="flex flex-col items-start space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Published on{" "}
                  {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                </p>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Link href={`/blog/${post.slug}`}>Read more &rarr;</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Optional: Add metadata
export const metadata = {
  title: "Blog | Our Latest Insights",
  description: "Read the latest articles, news, and updates from our team.",
};
