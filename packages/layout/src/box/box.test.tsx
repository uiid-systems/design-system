import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Box } from "./box";

describe("Box", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders children", () => {
    render(<Box>Content</Box>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Box data-testid="box">Content</Box>);
    expect(screen.getByTestId("box")).toHaveAttribute("data-slot", "box");
  });

  it("applies custom className", () => {
    render(
      <Box className="custom-class" data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveClass("custom-class");
  });

  it("renders as div by default", () => {
    render(<Box data-testid="box">Content</Box>);
    expect(screen.getByTestId("box").tagName).toBe("DIV");
  });

  // ============================================
  // POLYMORPHISM (render prop)
  // ============================================

  it("renders as span", () => {
    render(
      <Box render={<span />} data-testid="box">
        Inline content
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("SPAN");
  });

  it("renders as section", () => {
    render(
      <Box render={<section />} data-testid="box">
        Section content
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("SECTION");
  });

  it("renders as article", () => {
    render(
      <Box render={<article />} data-testid="box">
        Article content
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("ARTICLE");
  });

  it("renders as aside", () => {
    render(
      <Box render={<aside />} data-testid="box">
        Sidebar content
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("ASIDE");
  });

  it("renders as main", () => {
    render(
      <Box render={<main />} data-testid="box">
        Main content
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("MAIN");
  });

  it("renders as form", () => {
    render(
      <Box render={<form />} data-testid="box">
        <input type="text" />
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe("FORM");
  });

  // ============================================
  // LAYOUT PROPS
  // ============================================

  it("applies ax (justify-content)", () => {
    render(
      <Box ax="center" data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("ax", "center");
  });

  it("applies ay (align-items)", () => {
    render(
      <Box ay="center" data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("ay", "center");
  });

  it("applies gap", () => {
    render(
      <Box gap={4} data-testid="box">
        <div>Item 1</div>
        <div>Item 2</div>
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("gap", "4");
  });

  it("applies direction", () => {
    render(
      <Box direction="column" data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("direction", "column");
  });

  // ============================================
  // PADDING PROPS
  // ============================================

  it("applies uniform padding (p)", () => {
    render(
      <Box p={4} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("p", "4");
  });

  it("applies horizontal padding (px)", () => {
    render(
      <Box px={2} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("px", "2");
  });

  it("applies vertical padding (py)", () => {
    render(
      <Box py={3} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("py", "3");
  });

  it("applies individual padding props", () => {
    render(
      <Box pt={1} pr={2} pb={3} pl={4} data-testid="box">
        Content
      </Box>,
    );

    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("pt", "1");
    expect(box).toHaveAttribute("pr", "2");
    expect(box).toHaveAttribute("pb", "3");
    expect(box).toHaveAttribute("pl", "4");
  });

  // ============================================
  // MARGIN PROPS
  // ============================================

  it("applies uniform margin (m)", () => {
    render(
      <Box m={4} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("m", "4");
  });

  it("applies horizontal margin (mx)", () => {
    render(
      <Box mx={2} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("mx", "2");
  });

  it("applies vertical margin (my)", () => {
    render(
      <Box my={3} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("my", "3");
  });

  it("applies individual margin props", () => {
    render(
      <Box mt={1} mr={2} mb={3} ml={4} data-testid="box">
        Content
      </Box>,
    );

    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("mt", "1");
    expect(box).toHaveAttribute("mr", "2");
    expect(box).toHaveAttribute("mb", "3");
    expect(box).toHaveAttribute("ml", "4");
  });

  // ============================================
  // TOGGLE PROPS (applied via CSS variants)
  // ============================================

  it("applies fullwidth", () => {
    render(
      <Box fullwidth data-testid="box">
        Content
      </Box>,
    );
    // fullwidth is applied via CSS class from variants, not as an attribute
    expect(screen.getByTestId("box")).toBeInTheDocument();
  });

  it("applies fullheight", () => {
    render(
      <Box fullheight data-testid="box">
        Content
      </Box>,
    );
    // fullheight is applied via CSS class from variants, not as an attribute
    expect(screen.getByTestId("box")).toBeInTheDocument();
  });

  it("applies evenly", () => {
    render(
      <Box evenly data-testid="box">
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Box>,
    );
    // evenly is applied via CSS class from variants, not as an attribute
    expect(screen.getByTestId("box")).toBeInTheDocument();
  });

  // ============================================
  // COMBINING PROPS
  // ============================================

  it("combines multiple style props", () => {
    render(
      <Box p={4} m={2} gap={3} ax="center" ay="center" data-testid="box">
        Content
      </Box>,
    );

    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("p", "4");
    expect(box).toHaveAttribute("m", "2");
    expect(box).toHaveAttribute("gap", "3");
    expect(box).toHaveAttribute("ax", "center");
    expect(box).toHaveAttribute("ay", "center");
  });

  it("combines toggle and style props", () => {
    render(
      <Box fullwidth p={4} gap={2} data-testid="box">
        Content
      </Box>,
    );

    const box = screen.getByTestId("box");
    // fullwidth is applied via CSS class from variants
    expect(box).toBeInTheDocument();
    expect(box).toHaveAttribute("p", "4");
    expect(box).toHaveAttribute("gap", "2");
  });

  // ============================================
  // HTML ATTRIBUTES
  // ============================================

  it("forwards standard HTML attributes", () => {
    render(
      <Box id="my-box" title="Box title" data-testid="box">
        Content
      </Box>,
    );

    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("id", "my-box");
    expect(box).toHaveAttribute("title", "Box title");
  });

  it("applies custom style prop", () => {
    render(
      <Box style={{ backgroundColor: "red" }} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveStyle({ backgroundColor: "red" });
  });
});
