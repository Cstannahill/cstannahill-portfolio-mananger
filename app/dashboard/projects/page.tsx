"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import type { ProjectDashboard } from "@/types";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [projects, setProjects] = useState<ProjectDashboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: unknown) => {
        console.log("Raw API data:", data);
        // Defensive: handle all known API response shapes
        if (Array.isArray(data)) {
          setProjects(data as ProjectDashboard[]);
          console.log("Fetched projects (array):", data);
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as { projects?: unknown[] }).projects)
        ) {
          setProjects((data as { projects: ProjectDashboard[] }).projects);
          console.log(
            "Fetched projects (object.projects):",
            (data as any).projects
          );
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as { data?: unknown[] }).data)
        ) {
          setProjects((data as { data: ProjectDashboard[] }).data);
          console.log("Fetched projects (object.data):", (data as any).data);
        } else {
          setProjects([]);
          console.log("Fetched projects: [] (empty)");
        }
      })
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  // Filter projects based on search term and active tab
  const filteredProjects = projects?.filter((project: ProjectDashboard) => {
    const summaryText = project.summary || (project as any).description || "";
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summaryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.technologies || []).some((tech: string) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && project.status === activeTab;
  });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects here
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-[1fr_250px] gap-6">
        <div className="space-y-4">
          {/* Tabs and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="w-full sm:w-auto sm:ml-auto">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center p-8">Loading projects...</div>
            ) : error ? (
              <div className="text-center p-8 text-red-600">{error}</div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project: ProjectDashboard) => (
                <Card key={project._id} className="p-4">
                  <div className="grid md:grid-cols-[120px_1fr] gap-4">
                    <div className="w-full h-[100px] bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      {project.coverImage ? (
                        <img
                          src={project.coverImage}
                          alt={`${project.title} cover image`}
                          className="w-full h-full object-cover"
                        />
                      ) : project.images && project.images[0] ? (
                        <img
                          src={project.images[0]}
                          alt={`${project.title} image 1`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-muted text-center text-muted-foreground">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {project.summary ||
                              (project as any).description ||
                              ""}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {(project.technologies as string[])
                              .slice(0, 4)
                              .map((tech: string, index: number) => (
                                <Badge
                                  key={tech + index}
                                  variant="outline"
                                  className="bg-primary/10"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            {project.technologies.length > 4 && (
                              <Badge variant="outline">
                                +{project.technologies.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusBadge(project.status)}
                        >
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs text-muted-foreground">
                          Updated:{" "}
                          {new Date(project.publishedAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/projects/${project.slug}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/dashboard/projects/${project.slug}`}>
                            <Button variant="secondary" size="sm">
                              Manage
                            </Button>
                          </Link>
                          <Link
                            href={`/dashboard/projects/${project.slug}/edit`}
                          >
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8">
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Create your first project"}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/projects/new">
                    <Button>Create Project</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Projects</span>
                <span className="font-medium">{projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Published</span>
                <span className="font-medium">
                  {projects.filter((p) => p.status === "published").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Drafts</span>
                <span className="font-medium">
                  {projects.filter((p) => p.status === "draft").length}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Technologies</h3>
            <div className="space-y-2">
              {Array.from(
                new Set(
                  (projects || []).flatMap(
                    (project) => project.technologies || []
                  )
                )
              )
                .slice(0, 10)
                .map((tech: string) => (
                  <div key={tech} className="flex justify-between">
                    <span className="text-muted-foreground">{tech}</span>
                    <span className="font-medium">
                      {
                        projects.filter((project) =>
                          (project.technologies || []).includes(tech)
                        ).length
                      }
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
