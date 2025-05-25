"use client"; // Add this to enable client-side interactions

import { NextPage } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react"; // Import Trash2
import type { BlogPostSummary, BlogPostApiResponse } from "@/types";
import { toast } from "sonner";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { useRouter } from "next/navigation"; // Import useRouter

// AlertDialog components for delete confirmation
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Keep getBlogPosts as a server-side utility if preferred, or adapt for client-side
// For this implementation, we'll fetch client-side to manage state easily

const BlogManagementPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Error fetching blog posts: ${res.status} ${res.statusText}`,
          errorText
        );
        toast.error("Failed to fetch blog posts.", {
          description: `Server responded with ${res.status}. Please try again later.`,
        });
        setError(`Failed to fetch posts: ${res.status}`);
        return;
      }

      // Adjusted to match the actual API response structure
      const jsonResponse: {
        success: boolean;
        data?: { posts: BlogPostSummary[]; pagination: any };
        message?: string;
      } = await res.json();

      if (
        !jsonResponse.success ||
        !jsonResponse.data ||
        !jsonResponse.data.posts
      ) {
        console.error(
          "API response was not successful or data is malformed:",
          jsonResponse.message
        );
        toast.error("Failed to process blog posts data.", {
          description:
            jsonResponse.message ||
            "The server returned an unexpected or malformed response.",
        });
        setError(jsonResponse.message || "Invalid data format from server");
        return;
      }
      setPosts(jsonResponse.data.posts); // Use jsonResponse.data.posts
    } catch (err) {
      console.error("Network or other error fetching blog posts:", err);
      toast.error("An unexpected error occurred.", {
        description:
          "Could not connect to the server or another error occurred. Please check your connection and try again.",
      });
      setError((err as Error).message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleDeletePost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Blog post deleted successfully!");
        // Refresh the list of posts
        fetchBlogPosts();
        router.refresh(); // To ensure server components relying on this data also update if any
      } else {
        toast.error(result.error || "Failed to delete blog post.");
      }
    } catch (error) {
      toast.error(`An error occurred: ${(error as Error).message}`);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading blog posts...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button asChild>
          <Link href="/dashboard/blog/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p>No blog posts found. Get started by creating one!</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post._id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/dashboard/blog/${post.slug}/edit`}
                      className="block"
                    >
                      <p className="text-lg font-medium text-indigo-600 truncate hover:underline">
                        {post.title}
                      </p>
                    </Link>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/blog/${post.slug}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the blog post "
                              <strong>{post.title}</strong>".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePost(post.slug)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Published on:{" "}
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                      {post.excerpt && (
                        <p className="flex items-center text-sm text-gray-500 sm:ml-4 mt-1 sm:mt-0">
                          Excerpt: {post.excerpt}
                        </p>
                      )}
                    </div>
                    {/* <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                       <p>Status: {post.status}</p> 
                    </div> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlogManagementPage;
