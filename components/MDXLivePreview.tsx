// components/MDXLivePreview.tsx
"use client";
import React, { useEffect, useState, Fragment } from "react";
import { MDXProvider } from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";
import * as _jsx_runtime from "react/jsx-runtime";
import * as _jsx_dev_runtime from "react/jsx-dev-runtime";

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
        const { default: Component } = await evaluate(mdxSource, {
          ..._jsx_runtime,
          ..._jsx_dev_runtime,
          Fragment,
          development: process.env.NODE_ENV === "development",
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
