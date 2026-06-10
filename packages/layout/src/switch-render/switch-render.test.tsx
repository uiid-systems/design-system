import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SwitchRender } from "./switch-render";

describe("SwitchRender", () => {
  it("uses the true wrapper when condition is true", () => {
    render(
      <SwitchRender
        condition
        render={{
          true: <div data-testid="t" />,
          false: <div data-testid="f" />,
        }}
      >
        <span>Content</span>
      </SwitchRender>,
    );
    expect(screen.getByTestId("t")).toContainElement(
      screen.getByText("Content"),
    );
    expect(screen.queryByTestId("f")).not.toBeInTheDocument();
  });

  it("uses the false wrapper when condition is false", () => {
    render(
      <SwitchRender
        condition={false}
        render={{
          true: <div data-testid="t" />,
          false: <div data-testid="f" />,
        }}
      >
        <span>Content</span>
      </SwitchRender>,
    );
    expect(screen.getByTestId("f")).toContainElement(
      screen.getByText("Content"),
    );
    expect(screen.queryByTestId("t")).not.toBeInTheDocument();
  });

  it("forwards additional props onto the selected wrapper", () => {
    render(
      <SwitchRender
        condition
        data-testid="passed-through"
        render={{ true: <div />, false: <div /> }}
      >
        <span>x</span>
      </SwitchRender>,
    );
    expect(screen.getByTestId("passed-through")).toBeInTheDocument();
  });
});
