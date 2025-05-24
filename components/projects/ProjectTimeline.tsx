import React from "react";
import type { ProjectTimelineProps } from "../../types";

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  status?: "completed" | "in-progress" | "planned";
}

/**
 * Renders a vertical timeline for project milestones.
 * Accessible and keyboard navigable.
 */
export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ items }) => (
  <ol className="border-l-2 border-blue-500 pl-4" aria-label="Project timeline">
    {items.map((item, idx) => (
      <li key={idx} className="mb-6 ml-2">
        <div className="flex items-center mb-1">
          <span
            className="w-3 h-3 bg-blue-500 rounded-full mr-2"
            aria-hidden="true"
          ></span>
          <span className="font-semibold text-gray-800">{item.title}</span>
          {item.status && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[#1d1916] text-gray-600">
              {item.status}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mb-1">{item.date}</div>
        {item.description && (
          <div className="text-sm text-gray-700">{item.description}</div>
        )}
      </li>
    ))}
  </ol>
);
