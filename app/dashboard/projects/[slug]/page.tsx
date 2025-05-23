import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjectBySlug } from "@/lib/api/projects";
import { MDXLivePreview } from "@/components/MDXLivePreview";
import type { Project } from "@/types/project";

interface ProjectDashboardPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Internal dashboard page for detailed project management and overview.
 * Shows project analytics, management actions, and detailed information.
 * @param params - Promise containing the project slug parameter
 * @returns JSX element for the project dashboard page
 */
export default async function ProjectDashboardPage({
  params,
}: ProjectDashboardPageProps): Promise<React.JSX.Element> {
  let project: Project | null = null;
  let error: string | null = null;

  try {
    const { slug } = await params;
    // Explicitly cast the result to Project
    project = (await getProjectBySlug(slug)) as Project;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Failed to load project";
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Link href="/dashboard/projects" className="inline-block mt-4">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground">
            The requested project could not be found.
          </p>
          <Link href="/dashboard/projects" className="inline-block mt-4">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="text-sm text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            {" > "}
            <Link href="/dashboard/projects" className="hover:text-foreground">
              Projects
            </Link>
            {" > "}
            <span className="text-foreground">{project.title}</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">{project.summary}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${project.slug}`}>
            <Button variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Public View
            </Button>
          </Link>
          <Link href={`/dashboard/projects/${project.slug}/edit`}>
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Project Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={
                      project.status === "published"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : project.status === "draft"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                    }
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Published Date
                </label>
                <p className="mt-1">
                  {new Date(project.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Demo URL
                </label>
                <p className="mt-1">
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {project.demoUrl}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Source Code
                </label>
                <p className="mt-1">
                  {project.sourceUrl ? (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {project.sourceUrl}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Technologies */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string) => (
                <Badge key={tech} variant="outline" className="bg-primary/10">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Content Preview */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Content Preview</h2>
            <div className="border rounded-lg p-4 bg-muted/30">
              <MDXLivePreview mdxSource={project.content} />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href={`/projects/${project.slug}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Public Page
                </Button>
              </Link>
              <Link
                href={`/dashboard/projects/${project.slug}/edit`}
                className="block"
              >
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Project
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Project (Coming Soon)
              </Button>
            </div>
          </Card>

          {/* Project Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Project Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Images</span>
                <span className="font-medium">
                  {project.images?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Technologies</span>
                <span className="font-medium">
                  {project.technologies.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tags</span>
                <span className="font-medium">{project.tags.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content Length</span>
                <span className="font-medium">
                  {project.content.length} chars
                </span>
              </div>
            </div>
          </Card>

          {/* SEO Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">SEO Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Slug
                </label>
                <p className="mt-1 font-mono text-sm bg-muted px-2 py-1 rounded">
                  {project.slug}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Title Length
                </label>
                <p className="mt-1">
                  {project.title.length} characters
                  {project.title.length > 60 && (
                    <span className="text-amber-600 text-xs ml-2">
                      (Consider shortening for SEO)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Summary Length
                </label>
                <p className="mt-1">
                  {project.summary.length} characters
                  {project.summary.length > 160 && (
                    <span className="text-amber-600 text-xs ml-2">
                      (Consider shortening for SEO)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
