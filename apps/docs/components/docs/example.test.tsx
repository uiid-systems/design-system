import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, it, vi } from "vitest";

import { Example } from "./example";

// `getExampleSource` finds examples files from the working directory, which is
// the docs app under `next build` but the repo root under Vitest. It resolves
// the path when the module loads, so the working directory is set before that.
const cwd = vi.hoisted(() =>
  vi.spyOn(process, "cwd").mockReturnValue(`${import.meta.dirname}/../..`),
);

afterAll(() => {
  cwd.mockRestore();
});

// The docs app type-checks this file under `next build`, which has no jest-dom
// matcher types, so these assertions use Vitest's own matchers only.
//
// Calling the async component as a function renders it in one tree, against
// package source. It does not cross the server-to-client prop boundary or use
// built `dist`; `pnpm run build --filter=docs` and example.bundle.test.ts cover those.
const renderExample = async (props: Parameters<typeof Example>[0]) =>
  render(await Example(props));

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot='${name}']`);

describe("Example", () => {
  it("keeps the id and data-title on the outer element", async () => {
    const { container } = await renderExample({
      title: "Before and after slots",
      of: "buttons/button",
      name: "Default",
      children: <p>live</p>,
    });

    const outer = container.firstElementChild;
    expect(outer?.getAttribute("data-slot")).toBe("example");
    expect(outer?.id).toBe("before-and-after-slots");
    expect(outer?.getAttribute("data-title")).toBe("Before and after slots");
  });

  it("renders the title as a heading above the frame when there is source", async () => {
    const { container } = await renderExample({
      title: "Default",
      of: "buttons/button",
      name: "Default",
      children: <p>live</p>,
    });

    const heading = screen.getByRole("heading", { level: 3, name: "Default" });
    const frame = slot(container, "code-preview");
    expect(frame).not.toBeNull();
    expect(
      heading.compareDocumentPosition(frame!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(frame!.contains(heading)).toBe(false);
  });

  it("renders the example inside CodePreview with server-highlighted code", async () => {
    const { container } = await renderExample({
      title: "Default",
      of: "buttons/button",
      name: "Default",
      children: <p>live</p>,
    });

    expect(slot(container, "code-preview-canvas")?.textContent).toBe("live");
    expect(screen.getByRole("button", { name: /show code/i })).toBeTruthy();
    // Highlighted on the server: the panel already holds Shiki's markup.
    const panel = slot(container, "code-preview-panel");
    expect(panel?.querySelector(".shiki")).not.toBeNull();
  });

  it("starts the example at the canvas's start edge", async () => {
    const { container } = await renderExample({
      title: "Default",
      of: "buttons/button",
      name: "Default",
      children: <p>live</p>,
    });

    // The canvas is a column Stack, which writes its `ax` (the horizontal,
    // cross axis) to Box's `ay`, so the start alignment shows as `data-ui-ay`.
    const canvas = slot(container, "code-preview-canvas");
    expect(canvas?.getAttribute("data-ui-ay")).toBe("start");
  });

  it("renders the framed canvas alone when there is no source", async () => {
    const { container } = await renderExample({
      title: "Plain",
      children: <p>live</p>,
    });

    const heading = screen.getByRole("heading", { level: 3, name: "Plain" });
    const frame = slot(container, "code-preview");
    expect(frame).not.toBeNull();
    expect(
      heading.compareDocumentPosition(frame!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(frame!.contains(heading)).toBe(false);
    expect(slot(container, "code-preview-canvas")?.textContent).toBe("live");
    expect(screen.queryByRole("button", { name: /show code/i })).toBeNull();
    expect(container.querySelector("pre")).toBeNull();
  });

  it("passes resettable through to CodePreview", async () => {
    await renderExample({
      title: "Animated",
      of: "buttons/button",
      name: "Default",
      resettable: true,
      children: <p>live</p>,
    });

    expect(screen.getByRole("button", { name: "Reset preview" })).toBeTruthy();
  });

  it("renders no reset button by default", async () => {
    await renderExample({
      title: "Still",
      of: "buttons/button",
      name: "Default",
      children: <p>live</p>,
    });

    expect(screen.queryByRole("button", { name: "Reset preview" })).toBeNull();
  });
});
