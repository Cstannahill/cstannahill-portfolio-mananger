"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecentPosts() {
  // In a real app, these would be fetched from your API
  const posts = [
    {
      id: "1",
      title: "Getting Started with Next.js",
      excerpt:
        "Learn the basics of Next.js and how to build your first application",
      createdAt: "2 days ago",
      slug: "getting-started-with-nextjs",
    },
    {
      id: "2",
      title: "Mastering Tailwind CSS",
      excerpt: "Tips and tricks to become more efficient with Tailwind CSS",
      createdAt: "1 week ago",
      slug: "mastering-tailwind-css",
    },
    {
      id: "3",
      title: "The Power of MongoDB",
      excerpt: "Why MongoDB is a great choice for modern web applications",
      createdAt: "2 weeks ago",
      slug: "the-power-of-mongodb",
    },
  ];

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
        {posts.map((post) => (
          <div key={post.id} className="p-6">
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
                {post.createdAt}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
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
        ))}
      </div>
    </Card>
  );
}
