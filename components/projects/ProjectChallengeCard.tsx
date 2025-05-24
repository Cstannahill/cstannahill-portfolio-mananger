import React from "react";
import type { ProjectChallengeCardProps } from "../../types";

/**
 * Displays a card describing a project challenge, solution, and impact.
 * Accessible and keyboard navigable.
 */
export const ProjectChallengeCard: React.FC<ProjectChallengeCardProps> = ({
  title,
  challenge,
  solution,
  impact,
  difficulty,
  domain,
}) => (
  <section
    className="p-4 rounded shadow mb-4"
    tabIndex={0}
    aria-label={`Challenge: ${title}`}
  >
    <h4 className="text-lg font-bold mb-2">{title}</h4>
    <div className="mb-2">
      <span className="font-semibold">Challenge:</span> {challenge}
    </div>
    <div className="mb-2">
      <span className="font-semibold">Solution:</span> {solution}
    </div>
    {impact && (
      <div className="mb-2">
        <span className="font-semibold">Impact:</span> {impact}
      </div>
    )}
    <div className="flex flex-wrap gap-2 mt-2">
      {difficulty && (
        <span className="px-2 py-0.5 rounded bg-[#1d1916] text-xs text-gray-700">
          Difficulty: {difficulty}
        </span>
      )}
      {domain && (
        <span className="px-2 py-0.5 rounded bg-[#1d1916] text-xs text-gray-700">
          Domain: {domain}
        </span>
      )}
    </div>
  </section>
);
