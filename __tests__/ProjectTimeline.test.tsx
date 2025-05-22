// ProjectTimeline.test.tsx
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectTimeline } from "../components/projects/ProjectTimeline";

describe("ProjectTimeline", () => {
  it("renders timeline items with title, date, and description", () => {
    render(
      <ProjectTimeline
        items={[
          {
            date: "2025-01",
            title: "Start",
            description: "Project started",
            status: "completed",
          },
        ]}
      />
    );
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("2025-01")).toBeInTheDocument();
    expect(screen.getByText("Project started")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
  });

  it("is accessible with aria-label", () => {
    render(<ProjectTimeline items={[]} />);
    expect(screen.getByLabelText("Project timeline")).toBeInTheDocument();
  });
});
