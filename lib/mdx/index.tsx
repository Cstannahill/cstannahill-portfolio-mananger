import { MDXRemote } from "next-mdx-remote/rsc";
import { ProjectTechStack } from "@/components/projects";
import { ProjectTimeline } from "@/components/projects";
import { ProjectFeatureShowcase } from "@/components/projects";
import { ProjectMetrics } from "@/components/projects/ProjectMetrics";
import { ProjectChallengeCard } from "@/components/projects/ProjectChallengeCard";

const components = {
  ProjectTechStack,
  ProjectTimeline,
  ProjectFeatureShowcase,
  ProjectMetrics,
  ProjectChallengeCard,
};

export function MDXContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
