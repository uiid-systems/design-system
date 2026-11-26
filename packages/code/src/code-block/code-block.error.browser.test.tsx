import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { highlight } from "../highlighter/highlighter";
import { CodeBlock } from "./code-block";
import {
  getBlock,
  isHighlighted,
  mountSized,
  readBoxes,
} from "./code-block.browser.test.helpers";

import "@uiid/tokens/globals.css";

/* The real hook and component, with only Shiki's answer under the test's
   control, as a grammar or chunk that fails to load would leave it. This
   needs its own file: the mock applies to every test in it. */
vi.mock("../highlighter/highlighter", { spy: true });

const mockHighlight = vi.mocked(highlight);

afterEach(() => {
  mockHighlight.mockReset();
});

const CODE = "const a = 1;\nconst b = 2;";

const errorText = (root: ParentNode = document) =>
  root.querySelector('[data-slot="code-block-error"]');

const lineTexts = (root: ParentNode = document) =>
  [...root.querySelectorAll(".line")].map((line) => line.textContent);

describe("CodeBlock when highlighting fails", () => {
  it("shows the plain code with the error below it, and no line moves", async () => {
    let fail = (_error: Error) => {};
    mockHighlight.mockImplementation(
      () =>
        new Promise<string>((_, reject) => {
          fail = reject;
        }),
    );
    const container = mountSized(<CodeBlock code={CODE} />);
    const before = readBoxes(getBlock(container));

    fail(new Error("grammar failed to load"));
    await expect.poll(() => errorText(container)).not.toBeNull();
    expect(errorText(container)).toHaveTextContent("grammar failed to load");

    expect(isHighlighted(container)).toBe(false);
    expect(lineTexts(container)).toEqual(CODE.split("\n"));
    // The block grows by the message; every line keeps its box and text.
    const after = readBoxes(getBlock(container));
    expect(after.lines).toEqual(before.lines);
    expect(after.block.height).toBeGreaterThan(before.block.height);
  });

  it("shows the plain current code, not the last highlight of older code", async () => {
    const { rerender } = render(<CodeBlock code="const old = 0;" />);
    await expect.poll(() => isHighlighted()).toBe(true);
    expect(lineTexts()).toEqual(["const old = 0;"]);

    mockHighlight.mockRejectedValue(new Error("grammar failed to load"));
    rerender(<CodeBlock code={CODE} />);
    await expect.poll(() => errorText()).not.toBeNull();

    expect(isHighlighted()).toBe(false);
    expect(lineTexts()).toEqual(CODE.split("\n"));
  });
});
