"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/blog/BlogForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPostFull } from "@/types/blog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditBlogPostPage: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/blog/${slug}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error ||
                `Failed to fetch blog post: ${response.statusText}`
            );
          }
          const data = await response.json();
          if (data.success && data.data) {
            setPost(data.data);
          } else {
            throw new Error(
              data.error || "Blog post not found or invalid data format."
            );
          }
        } catch (err) {
          console.error("Error fetching blog post:", err);
          setError((err as Error).message);
          toast.error(`Error: ${(err as Error).message}`);
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading post data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <p>Error loading blog post: {error}</p>
        <p>
          Please try refreshing the page or contact support if the issue
          persists.
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog Post: {post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm mode="edit" initialData={post} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlogPostPage;
