import { render, screen } from "@testing-library/react";
import { describe, it, expect, expectTypeOf } from "vitest";

import { Prose } from "./prose";
import * as Examples from "./prose.examples";
import type { ProseProps } from "./prose.types";

describe("Prose", () => {
  it("renders children in a div with its slot and class", () => {
    render(
      <Prose className="custom">
        <p>Body</p>
      </Prose>,
    );

    const prose = screen.getByText("Body").parentElement;
    expect(prose?.tagName).toBe("DIV");
    expect(prose).toHaveAttribute("data-slot", "prose");
    expect(prose).toHaveClass("custom");
  });

  it("renders as the render element", () => {
    render(
      <Prose render={<article />}>
        <p>Body</p>
      </Prose>,
    );

    expect(screen.getByText("Body").parentElement?.tagName).toBe("ARTICLE");
  });

  it("writes spacing props as data-ui attributes", () => {
    render(
      <Prose p={4} mb={2}>
        <p>Body</p>
      </Prose>,
    );

    const prose = screen.getByText("Body").parentElement;
    expect(prose).toHaveAttribute("data-ui-p", "4");
    expect(prose).toHaveAttribute("data-ui-mb", "2");
  });

  it("renders the Markdown example", () => {
    render(<Examples.Markdown />);

    expect(
      screen.getByRole("heading", { level: 1, name: "UIID Design System" }),
    ).toBeInTheDocument();
  });

  it("takes padding and margin but no gap", () => {
    expectTypeOf<ProseProps>().not.toHaveProperty("gap");
    render(
      <Prose p={2} mt={1}>
        <p>Body</p>
      </Prose>,
    );
    const prose = screen.getByText("Body").parentElement;
    expect(prose).toHaveAttribute("data-ui-p", "2");
    expect(prose).toHaveAttribute("data-ui-mt", "1");
  });
});
