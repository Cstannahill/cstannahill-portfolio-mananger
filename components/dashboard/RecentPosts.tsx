"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BlogPostSummary } from "@/types/blog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecentPosts() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/blog?limit=3", { cache: "no-store" });
        if (!res.ok) throw new Error(`Error fetching posts: ${res.status}`);
        const json = await res.json();
        if (!json.success || !json.data?.posts)
          throw new Error(json.message || "Invalid data format");
        setPosts(json.data.posts);
      } catch (err) {
        console.error("Error fetching recent blog posts:", err);
        setError(err instanceof Error ? err.message : String(err));
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-border/50">
          <h2 className="text-lg font-semibold">Recent Blog Posts</h2>
          <Button variant="outline" size="sm" disabled>
            View All
          </Button>
        </div>
        <div className="p-6 text-center text-muted-foreground">
          Loading recent blog posts...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-border/50">
          <h2 className="text-lg font-semibold">Recent Blog Posts</h2>
          <Link href="/dashboard/blog">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="p-6 text-center text-red-500">Error: {error}</div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-border/50">
        <h2 className="text-lg font-semibold">Recent Blog Posts</h2>
        <Link href="/dashboard/blog">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-border/50">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/dashboard/blog/${post.slug}`}
                  className="text-base font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {new Date(post.publishedAt).toLocaleDateString()}
                </Badge>
              </div>
              {post.excerpt && (
                <p className="text-muted-foreground text-sm mb-4">
                  {post.excerpt}
                </p>
              )}
              <div className="flex justify-end">
                <Link href={`/dashboard/blog/${post.slug}/edit`}>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No recent blog posts found.
          </div>
        )}
      </div>
    </Card>
  );
}
