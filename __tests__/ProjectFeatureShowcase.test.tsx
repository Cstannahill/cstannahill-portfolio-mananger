import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectFeatureShowcase } from "../components/projects/ProjectFeatureShowcase";

describe("ProjectFeatureShowcase", () => {
  it("renders feature groups with titles, images, and features", () => {
    render(
      <ProjectFeatureShowcase
        groups={[
          {
            title: "Core",
            image: "/img.png",
            features: [
              { title: "X", description: "desc", status: "implemented" },
            ],
          },
        ]}
      />
    );
    expect(screen.getByText("Core")).toBeInTheDocument();
    expect(screen.getByAltText("Core")).toBeInTheDocument();
    expect(screen.getByText("X:")).toBeInTheDocument();
    expect(screen.getByText("desc")).toBeInTheDocument();
    expect(screen.getByText("implemented")).toBeInTheDocument();
  });

  it("is accessible with aria-label", () => {
    render(<ProjectFeatureShowcase groups={[]} />);
    expect(
      screen.getByLabelText("Project feature showcase")
    ).toBeInTheDocument();
  });
});
