import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectMetrics } from "../components/projects/ProjectMetrics";

describe("ProjectMetrics", () => {
  it("renders metrics with label, value, icon, and progress", () => {
    render(
      <ProjectMetrics
        metrics={[
          { label: "Performance", value: "95%", icon: "⚡", progress: 95 },
        ]}
      />
    );
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("95%"));
    expect(screen.getByText("⚡")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "95"
    );
  });

  it("is accessible with aria-label", () => {
    render(<ProjectMetrics metrics={[]} />);
    expect(screen.getByLabelText("Project metrics")).toBeInTheDocument();
  });
});
