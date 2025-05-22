import React from "react";
import type { ProjectMetricsProps } from "../../types";

interface Metric {
  label: string;
  value: string;
  icon?: string;
  progress?: number;
}

/**
 * Displays project metrics as labeled values with optional icons and progress bars.
 * Accessible and keyboard navigable.
 */
export const ProjectMetrics: React.FC<ProjectMetricsProps> = ({ metrics }) => (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    aria-label="Project metrics"
  >
    {metrics.map((metric, idx) => (
      <div
        key={metric.label + idx}
        className="flex flex-col p-4 bg-gray-50 rounded shadow"
      >
        <div className="flex items-center mb-2">
          {metric.icon && (
            <span className="mr-2 text-xl" aria-hidden="true">
              {metric.icon}
            </span>
          )}
          <span className="font-semibold text-gray-800">{metric.label}</span>
        </div>
        <span className="text-2xl font-bold text-blue-600">{metric.value}</span>
        {typeof metric.progress === "number" && (
          <div
            className="w-full bg-gray-200 rounded h-2 mt-2"
            aria-label={`Progress for ${metric.label}`}
            tabIndex={0}
          >
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${metric.progress}%` }}
              aria-valuenow={metric.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
        )}
      </div>
    ))}
  </div>
);
