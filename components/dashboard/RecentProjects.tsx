"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectDashboard } from "@/types"; // Assuming ProjectDashboard type is available

export function RecentProjects() {
  const [recentProjects, setRecentProjects] = useState<ProjectDashboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "/api/projects?limit=3&sort=updatedAt:desc"
        ); // Fetch 3 most recently updated
        if (!response.ok) {
          throw new Error("Failed to fetch recent projects");
        }
        const data = await response.json();
        // Handle different API response shapes for projects
        let projectsArray: ProjectDashboard[] = [];
        if (Array.isArray(data)) {
          projectsArray = data;
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as any).projects)
        ) {
          projectsArray = (data as any).projects;
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as any).data)
        ) {
          projectsArray = (data as any).data;
        }
        setRecentProjects(projectsArray);
      } catch (err) {
        console.error("Error fetching recent projects:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setRecentProjects([]); // Default to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "Completed": // Keep for backward compatibility if old data uses this
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "In Progress": // Keep for backward compatibility
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Planning": // Keep for backward compatibility
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-border/50">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Button variant="outline" size="sm" disabled>
            View All
          </Button>
        </div>
        <div className="p-6 text-center text-muted-foreground">
          Loading recent projects...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-border/50">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Link href="/dashboard/projects">
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
        <h2 className="text-lg font-semibold">Recent Projects</h2>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-border/50">
        {recentProjects.length > 0 ? (
          recentProjects.map((project) => (
            <div key={project._id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/dashboard/projects/${project.slug}`}
                  className="text-base font-medium hover:underline"
                >
                  {project.title}
                </Link>
                <Badge
                  className={getStatusColor(project.status)}
                  variant="outline"
                >
                  {project.status
                    ? project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)
                    : "Unknown"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.summary}
              </p>
              <div className="flex justify-end">
                <Link href={`/dashboard/projects/${project.slug}/edit`}>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <Link href={`/projects/${project.slug}`} target="_blank">
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No recent projects found.
          </div>
        )}
      </div>
    </Card>
  );
}
