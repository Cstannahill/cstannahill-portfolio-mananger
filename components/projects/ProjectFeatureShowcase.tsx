import React from "react";
import type { ProjectFeatureShowcaseProps } from "../../types";

interface Feature {
  title: string;
  description: string;
  status?: string;
}

interface FeatureGroup {
  title: string;
  image?: string;
  features: Feature[];
}

/**
 * Displays grouped project features with optional images.
 * Accessible and keyboard navigable.
 */
export const ProjectFeatureShowcase: React.FC<ProjectFeatureShowcaseProps> = ({
  groups,
}) => (
  <div className="space-y-8" aria-label="Project feature showcase">
    {groups.map((group, idx) => (
      <section key={group.title + idx} className="bg-[#1d1916]">
        <h3 className="text-lg font-semibold mb-2">{group.title}</h3>
        {group.image && (
          <img
            src={group.image}
            alt={group.title}
            className="mb-4 rounded shadow"
          />
        )}
        <ul className="space-y-2">
          {group.features.map((feature, fidx) => (
            <li key={feature.title + fidx} className="flex items-center">
              <span className="font-medium text-gray-800 mr-2">
                {feature.title}:
              </span>
              <span className="text-gray-700">{feature.description}</span>
              {feature.status && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[#1d1916] text-gray-600">
                  {feature.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);
