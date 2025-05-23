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

/**
 * Project detail page for /projects/[slug].
 * @param params - Promise resolving to route params with slug
 * @returns Project detail JSX
 */
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const project: Project | null = (await getProjectBySlug(
    slug
  )) as Project | null;

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-500 mb-4">
          {new Date(project.publishedAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech: string, idx: number) => (
            <span key={tech} className="badge">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
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

      <article className="prose">
        <MDXContent source={project.content} />
      </article>
    </div>
  );
}
