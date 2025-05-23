import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectChallengeCard } from "../components/projects/ProjectChallengeCard";

describe("ProjectChallengeCard", () => {
  it("renders all fields when provided", () => {
    render(
      <ProjectChallengeCard
        title="Challenge"
        challenge="Hard bug"
        solution="Fixed it"
        impact="Improved stability"
        difficulty="hard"
        domain="backend"
      />
    );
    expect(screen.getByText("Challenge")).toBeInTheDocument();
    expect(screen.getByText("Hard bug")).toBeInTheDocument();
    expect(screen.getByText("Fixed it")).toBeInTheDocument();
    expect(screen.getByText("Improved stability")).toBeInTheDocument();
    expect(screen.getByText("Difficulty: hard")).toBeInTheDocument();
    expect(screen.getByText("Domain: backend")).toBeInTheDocument();
  });

  it("is accessible with aria-label", () => {
    render(
      <ProjectChallengeCard title="Accessibility" challenge="A" solution="B" />
    );
    expect(
      screen.getByLabelText("Challenge: Accessibility")
    ).toBeInTheDocument();
  });
});
