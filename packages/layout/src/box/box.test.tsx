import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Box } from "./box";

import styles from "./box.module.css";

describe("Box", () => {
  it("renders children inside a div with data-slot", () => {
    render(<Box data-testid="box">Hello</Box>);
    const box = screen.getByTestId("box");
    expect(box.tagName).toBe("DIV");
    expect(box).toHaveAttribute("data-slot", "box");
    expect(box).toHaveTextContent("Hello");
  });

  it("turns numeric spacing props into a calc() inline style", () => {
    render(
      <Box p={4} data-testid="box">
        x
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveStyle({
      padding: "calc(4 * var(--spacing-unit))",
    });
  });

  it("turns string alignment props into a plain inline style", () => {
    render(
      <Box ax="center" data-testid="box">
        x
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveStyle({ justifyContent: "center" });
  });

  it("applies a CSS module class for toggle props", () => {
    render(
      <Box fullwidth data-testid="box">
        x
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveClass(styles["toggle-fullwidth"]);
  });

  it("renders as a different element via the render prop", () => {
    render(
      <Box render={<section />} data-testid="box">
        x
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("SECTION");
  });

  it("merges user className with Box's own", () => {
    render(
      <Box className="custom" data-testid="box">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveClass("custom");
    expect(box).toHaveClass(styles["box"]);
  });

  it("merges user style with Box's computed style", () => {
    render(
      <Box p={4} style={{ backgroundColor: "red" }} data-testid="box">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveStyle({ backgroundColor: "red" });
    expect(box).toHaveStyle({ padding: "calc(4 * var(--spacing-unit))" });
  });

  it("forwards standard HTML attributes and event handlers", () => {
    const onClick = vi.fn();
    render(
      <Box id="my-box" aria-label="card" onClick={onClick} data-testid="box">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("id", "my-box");
    expect(box).toHaveAttribute("aria-label", "card");
    box.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
