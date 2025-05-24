import { getProjectBySlug } from "@/lib/api/projects";
import { MDXContent } from "@/lib/mdx";
import {
  ProjectTechStack,
  ProjectTimeline,
  ProjectFeatureShowcase,
  ProjectMetrics,
  ProjectChallengeCard,
} from "@/components/projects";
import type { Technology, Project } from "@/types/project";
import { notFound } from "next/navigation"; // Added notFound

/**
 * Project detail page for /projects/[slug].
 * @param params - Promise resolving to route params with slug
 * @returns Project detail JSX
 */

// TODO: If this page should be statically generated for known slugs,
// implement generateStaticParams. Example:
// export async function generateStaticParams(): Promise<{ slug: string }[]> {
//   // const projectsData = await someFunctionToGetAllProjectSlugs();
//   // return projectsData.map(project => ({ slug: project.slug }));
//   return []; // Placeholder - returning empty array means no params pre-built
// }

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  let resolvedSlug: string;
  try {
    // R1, R2, R3, R4, R8 are met by this structure
    const { slug } = await params;
    resolvedSlug = slug;
  } catch (error) {
    // R5: try/catch for param resolution
    console.error(
      "Failed to resolve route parameters for project detail page:",
      error
    );
    // This typically happens for malformed URLs or fundamental routing issues.
    // Render a generic error or a more specific one based on your app's needs.
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error: Invalid project URL.
      </div>
    );
  }

  let project: Project | null = null;
  try {
    project = (await getProjectBySlug(resolvedSlug)) as Project | null;
  } catch (error) {
    console.error(
      `Failed to fetch project with slug "${resolvedSlug}":`,
      error
    );
    // This could be an API error, database issue, etc.
    // Consider a more user-friendly error display for production.
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error loading project data. Please try again later.
      </div>
    );
  }

  if (!project) {
    notFound(); // Use notFound() for 404 cases
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-500 mb-4">
          {new Date(project.publishedAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2 mb-4">
          {/* Ensure 'technologies' is an array of strings if directly mapping */}
          {/* If 'technologies' are objects, map to their names */}
          {project.technologies &&
            Array.isArray(project.technologies) &&
            project.technologies.slice(0, 4).map((tech: any, idx: number) => (
              <span key={idx} className="badge">
                {
                  typeof tech === "string"
                    ? tech
                    : tech.name /* Adjust if tech is an object */
                }
              </span>
            ))}
          {project.technologies && project.technologies.length > 4 && (
            <span className="badge">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
        <div className="flex gap-4">
          {project.demoUrl && (
            <a href={project.demoUrl} className="button">
              View Demo
            </a>
          )}
          {project.sourceUrl && (
            <a href={project.sourceUrl} className="button">
              Source Code
            </a>
          )}
        </div>
      </header>

      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full mb-8"
        />
      )}

      <article className="prose dark:prose-invert max-w-none">
        {" "}
        {/* Added max-w-none for prose styling */}
        <MDXContent source={project.content} />
      </article>
    </div>
  );
}
