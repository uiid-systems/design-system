import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

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

  it("merges className with the selected wrapper's rather than replacing it", () => {
    render(
      <SwitchRender
        condition
        className="ours"
        render={{
          true: <div data-testid="t" className="theirs" />,
          false: <div />,
        }}
      >
        <span>x</span>
      </SwitchRender>,
    );
    expect(screen.getByTestId("t")).toHaveClass("ours", "theirs");
  });

  it("merges style with the selected wrapper's rather than replacing it", () => {
    render(
      <SwitchRender
        condition
        style={{ color: "red" }}
        render={{
          true: <div data-testid="t" style={{ opacity: 0.5 }} />,
          false: <div />,
        }}
      >
        <span>x</span>
      </SwitchRender>,
    );
    expect(screen.getByTestId("t")).toHaveStyle({
      color: "red",
      opacity: "0.5",
    });
  });

  it("runs both click handlers rather than dropping the wrapper's", () => {
    const calls: string[] = [];
    render(
      <SwitchRender
        condition
        onClick={() => calls.push("ours")}
        render={{
          true: <button data-testid="t" onClick={() => calls.push("theirs")} />,
          false: <div />,
        }}
      >
        x
      </SwitchRender>,
    );
    fireEvent.click(screen.getByTestId("t"));
    expect(calls).toEqual(["ours", "theirs"]);
  });
});
