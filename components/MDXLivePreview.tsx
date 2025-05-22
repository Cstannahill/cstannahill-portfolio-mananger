// components/MDXLivePreview.tsx
import React, { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import * as devRuntime from "react/jsx-dev-runtime";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { ProjectFeatureShowcase } from "@/components/projects/ProjectFeatureShowcase";
import { ProjectMetrics } from "@/components/projects/ProjectMetrics";
import { ProjectChallengeCard } from "@/components/projects/ProjectChallengeCard";
import { Callout } from "@/components/Callout";

export interface MDXLivePreviewProps {
  mdxSource: string;
}

export const MDXLivePreview: React.FC<MDXLivePreviewProps> = ({
  mdxSource,
}) => {
  const components = {
    Callout,
    ProjectTechStack,
    ProjectTimeline,
    ProjectFeatureShowcase,
    ProjectMetrics,
    ProjectChallengeCard,
  };

  const [MDXContent, setMDXContent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function evaluateMDX() {
      if (!mdxSource.trim()) {
        setMDXContent(() => () => (
          <div className="text-zinc-400">Nothing to preview.</div>
        ));
        setError(null);
        return;
      }

      try {
        // Use the appropriate runtime based on environment
        const isDevelopment = process.env.NODE_ENV === "development";
        const jsxRuntime = isDevelopment ? devRuntime : runtime;

        const { default: Component } = await evaluate(mdxSource, {
          ...jsxRuntime,
          development: isDevelopment,
          useMDXComponents: () => components,
        });

        if (!cancelled) {
          setMDXContent(() => Component);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setMDXContent(() => () => (
            <div className="text-red-500">
              MDX parse error: {(err as Error).message}
            </div>
          ));
          setError((err as Error).message);
        }
      }
    }

    evaluateMDX();
    return () => {
      cancelled = true;
    };
  }, [mdxSource]);

  return (
    <MDXProvider components={components}>
      {MDXContent ? (
        <MDXContent />
      ) : (
        <div className="text-zinc-400">Loading preview…</div>
      )}
    </MDXProvider>
  );
};
