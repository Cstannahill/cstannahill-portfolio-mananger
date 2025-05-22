import React from "react";
import type { ProjectTechStackProps } from "../../types";

/**
 * Renders a list of technology badges with optional icons and roles.
 * Accessible and keyboard navigable.
 */
export const ProjectTechStack: React.FC<ProjectTechStackProps> = ({
  technologies,
}) => (
  <div className="flex flex-wrap gap-2" aria-label="Project tech stack">
    {technologies.map((tech, idx) => (
      <span
        key={tech.name + idx}
        className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-gray-800 text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        tabIndex={0}
        aria-label={tech.role ? `${tech.name}, ${tech.role}` : tech.name}
      >
        {tech.icon && (
          <span className="mr-1" aria-hidden="true">
            {tech.icon}
          </span>
        )}
        {tech.name}
        {tech.role && (
          <span className="ml-1 text-xs text-gray-500">({tech.role})</span>
        )}
      </span>
    ))}
  </div>
);
