import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectTechStack } from "../components/projects/ProjectTechStack";

describe("ProjectTechStack", () => {
  it("renders technology badges with icons and roles", () => {
    render(
      <ProjectTechStack
        technologies={[
          { name: "Next.js", icon: "▲", role: "primary" },
          { name: "TypeScript", icon: "🔷", role: "secondary" },
        ]}
      />
    );
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("▲")).toBeInTheDocument();
    expect(screen.getByText("🔷")).toBeInTheDocument();
    expect(screen.getByText("(primary)")).toBeInTheDocument();
    expect(screen.getByText("(secondary)")).toBeInTheDocument();
  });

  it("is accessible and keyboard navigable", () => {
    render(
      <ProjectTechStack
        technologies={[{ name: "MongoDB", icon: "🍃", role: undefined }]}
      />
    );
    const badge = screen.getByLabelText("MongoDB");
    expect(badge).toHaveAttribute("tabindex", "0");
  });
});
