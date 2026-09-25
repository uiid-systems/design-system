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

  it("puts a style prop on the element as a data attribute and a raw var", () => {
    render(
      <Box p={4} data-testid="box">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("data-ui-p", "4");
    expect(box.style.getPropertyValue("--props-p")).toBe("4");
    expect(box.style.padding).toBe("");
  });

  it("writes each spacing prop under its own key", () => {
    render(
      <Box px={4} data-testid="box">
        x
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("data-ui-px", "4");
  });

  it("writes a pair per breakpoint for a responsive value", () => {
    render(
      <Box gap={{ base: 2, sm: 6 }} data-testid="box">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("data-ui-gap", "2");
    expect(box).toHaveAttribute("data-ui-gap-sm", "6");
    expect(box.style.getPropertyValue("--props-gap-sm")).toBe("6");
  });

  it("writes nothing for a breakpoint a responsive value leaves out", () => {
    render(
      <Box gap={{ base: 2 }} data-testid="box">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("data-ui-gap", "2");
    expect(box).not.toHaveAttribute("data-ui-gap-sm");
  });

  it("writes keyword props verbatim", () => {
    render(
      <Box ax="center" data-testid="box">
        x
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("data-ui-ax", "center");
  });

  it("writes a bare data attribute for a toggle that is on", () => {
    render(
      <Box fullwidth evenly={false} data-testid="box">
        x
      </Box>,
    );
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("data-ui-fullwidth", "");
    expect(box).not.toHaveAttribute("data-ui-evenly");
    expect(box).not.toHaveAttribute("fullwidth");
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
    expect(box).toHaveAttribute("data-ui-p", "4");
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
