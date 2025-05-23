import React from "react";
import { render, screen } from "@testing-library/react";
import { Callout } from "../components/Callout";

describe("Callout", () => {
  it("renders with title, icon, and children", () => {
    render(
      <Callout title="Info" icon="ℹ️" type="info">
        This is an info callout.
      </Callout>
    );
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("This is an info callout.")).toBeInTheDocument();
    expect(screen.getByText("ℹ️")).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveAttribute(
      "aria-label",
      "info callout: Info"
    );
  });

  it("renders with only children and default type", () => {
    render(<Callout>This is a default callout.</Callout>);
    expect(screen.getByText("This is a default callout.")).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveAttribute(
      "aria-label",
      "info callout"
    );
  });

  it("applies correct style for type", () => {
    render(
      <Callout type="error" title="Error">
        Error occurred.
      </Callout>
    );
    const note = screen.getByRole("note");
    expect(note.className).toMatch(/border-red-400/);
    expect(note.className).toMatch(/bg-red-50/);
  });
});
