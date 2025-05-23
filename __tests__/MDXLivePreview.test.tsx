// MDXLivePreview.test.tsx
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MDXLivePreview } from "../components/MDXLivePreview";

describe("MDXLivePreview", () => {
  it("renders plain markdown content", async () => {
    render(<MDXLivePreview mdxSource={"# Hello World"} />);

    // Wait for the MDX to compile and render
    await waitFor(
      () => {
        expect(screen.getByText("Hello World")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("renders custom MDX components", async () => {
    render(
      <MDXLivePreview mdxSource={"<Callout title='Test'>Content</Callout>"} />
    );

    // Wait for the MDX to compile and render
    await waitFor(
      () => {
        expect(screen.getByText("Test")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(screen.getByText("Content")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows error for invalid MDX", async () => {
    render(<MDXLivePreview mdxSource={"<Broken>"} />);

    // Wait for the error to appear
    await waitFor(
      () => {
        expect(screen.getByText(/MDX parse error/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows placeholder for empty content", async () => {
    render(<MDXLivePreview mdxSource={""} />);

    await waitFor(
      () => {
        expect(screen.getByText("Nothing to preview.")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
