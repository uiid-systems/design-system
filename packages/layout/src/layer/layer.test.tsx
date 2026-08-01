import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Layer } from "./layer";

import styles from "./layer.module.css";

describe("Layer", () => {
  it("renders children inside a layer container with data-slot=layer", () => {
    const { container } = render(
      <Layer>
        <div data-testid="child" />
      </Layer>,
    );
    const layer = container.querySelector('[data-slot="layer"]') as HTMLElement;
    expect(layer).toHaveClass(styles["layer"]);
    expect(layer).toContainElement(screen.getByTestId("child"));
  });

  it("sets offset CSS variables when offset is provided", () => {
    const { container } = render(
      <Layer offset={{ x: 10, y: 5 }}>
        <div />
      </Layer>,
    );
    const layer = container.querySelector('[data-slot="layer"]') as HTMLElement;
    expect(layer.style.getPropertyValue("--layer-offset-x")).toBe("10px");
    expect(layer.style.getPropertyValue("--layer-offset-y")).toBe("5px");
  });

  it("does not set offset variables when offset is not provided", () => {
    const { container } = render(
      <Layer>
        <div />
      </Layer>,
    );
    const layer = container.querySelector('[data-slot="layer"]') as HTMLElement;
    expect(layer.style.getPropertyValue("--layer-offset-x")).toBe("");
    expect(layer.style.getPropertyValue("--layer-offset-y")).toBe("");
  });

  it("renders inline fragment children as direct DOM siblings", () => {
    const { container } = render(
      <Layer offset={{ x: 10 }}>
        <>
          <div data-testid="a" />
          <div data-testid="b" />
          <div data-testid="c" />
        </>
      </Layer>,
    );
    const layer = container.querySelector('[data-slot="layer"]') as HTMLElement;
    expect(layer.children).toHaveLength(3);
    expect(layer.children[0]).toBe(screen.getByTestId("a"));
    expect(layer.children[2]).toBe(screen.getByTestId("c"));
  });

  it("renders component-returning-fragment children as direct DOM siblings", () => {
    const FragmentComponent = () => (
      <>
        <div data-testid="x" />
        <div data-testid="y" />
        <div data-testid="z" />
      </>
    );

    const { container } = render(
      <Layer offset={{ x: 10 }}>
        <FragmentComponent />
      </Layer>,
    );
    const layer = container.querySelector('[data-slot="layer"]') as HTMLElement;
    expect(layer.children).toHaveLength(3);
    expect(layer.children[0]).toBe(screen.getByTestId("x"));
    expect(layer.children[2]).toBe(screen.getByTestId("z"));
  });
});
