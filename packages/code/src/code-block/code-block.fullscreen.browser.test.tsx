import { render } from "@testing-library/react";
import { Dialog } from "@uiid/overlays";
import * as React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeBlock } from "./code-block";

// The popup composition, the dialog and spacing tokens come from the global sheet.
import "@uiid/tokens/globals.css";

/* Runs in a real browser, which resolves the layout happy-dom cannot: the
   dialog viewport places the fullscreen view and the block's own scroll area
   scrolls the code. Prerendered `html` keeps every measurement off the async
   Shiki load. Boxes are read from `offset*`, which ignore the transform the
   open transition scales through. */

beforeEach(async () => {
  // Events here come from outside React, so act() never wraps them.
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = false;
  await page.viewport(1280, 800);
});

const LONG = Array.from({ length: 200 }, (_, i) => `const n${i} = ${i};`).join(
  "\n",
);

const toHtml = (code: string) =>
  `<pre class="shiki"><code>${code
    .split("\n")
    .map((line) => `<span class="line">${line}</span>`)
    .join("\n")}</code></pre>`;

/** A CSS length, such as a token, resolved to pixels by a probe element. */
const toPx = (length: string) => {
  const probe = document.createElement("div");
  probe.style.width = length;
  document.body.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
};

const openFullscreen = async () => {
  await userEvent.click(
    page.getByRole("button", { name: "Enter fullscreen" }).element(),
  );
  const dialog = page.getByRole("dialog", { name: "a.ts" });
  await expect.element(dialog).toBeInTheDocument();
  return dialog.element() as HTMLElement;
};

/* The dialog viewport's padding (1.5rem, and 0.75rem under 30rem tall) and that
   breakpoint are overlays' values, from packages/overlays/src/dialog/dialog.module.css. */
describe("CodeBlock fullscreen view", () => {
  it("fills the viewport's height inside its padding, capped at 1100px wide and centred", async () => {
    render(
      <CodeBlock
        code={LONG}
        html={toHtml(LONG)}
        filename="a.ts"
        fullscreenable
      />,
    );
    const popup = await openFullscreen();
    const viewport = popup.parentElement!;
    const inset = toPx("1.5rem");

    expect(viewport).toHaveAttribute("data-slot", "dialog-viewport");
    expect(popup.offsetHeight).toBeCloseTo(
      viewport.clientHeight - 2 * inset,
      0,
    );
    expect(popup.offsetWidth).toBe(1100);
    expect(popup.offsetLeft).toBeCloseTo((viewport.clientWidth - 1100) / 2, 0);
    expect(getComputedStyle(popup).boxShadow).not.toBe("none");
  });

  it("fills the inset width below the cap", async () => {
    await page.viewport(800, 600);
    render(
      <CodeBlock code="x" html={toHtml("x")} filename="a.ts" fullscreenable />,
    );
    const popup = await openFullscreen();
    const viewport = popup.parentElement!;

    expect(popup.offsetWidth).toBeCloseTo(
      viewport.clientWidth - 2 * toPx("1.5rem"),
      0,
    );
  });

  it("still fits a short screen, with the exit button in reach and the code scrolling", async () => {
    // Under 30rem tall the dialog drops its inset to 0.75rem and lets its
    // viewport scroll; the view should still fit, so nothing scrolls away.
    await page.viewport(375, 250);
    render(
      <CodeBlock
        code={LONG}
        html={toHtml(LONG)}
        filename="a.ts"
        fullscreenable
      />,
    );
    const popup = await openFullscreen();
    const viewport = popup.parentElement!;
    const inset = toPx("0.75rem");
    const content = popup.querySelector<HTMLElement>(
      '[data-slot="code-block-content"]',
    )!;
    const exit = page.getByRole("button", { name: "Exit fullscreen" });

    expect(popup.offsetTop).toBeCloseTo(inset, 0);
    expect(popup.offsetHeight).toBeCloseTo(
      viewport.clientHeight - 2 * inset,
      0,
    );
    expect(viewport.scrollHeight).toBe(viewport.clientHeight);
    // The dialog popup's short-screen rule sets overflow-y: visible; the frame
    // still clips.
    expect(getComputedStyle(popup).overflowY).toBe("hidden");
    expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);

    const exitBox = (exit.element() as HTMLElement).getBoundingClientRect();
    expect(exitBox.top).toBeGreaterThanOrEqual(0);
    expect(exitBox.bottom).toBeLessThanOrEqual(viewport.clientHeight);

    await userEvent.click(exit.element());
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });

  it("scrolls the code in the block's own scroll area, under a fixed header", async () => {
    render(
      <CodeBlock
        code={LONG}
        html={toHtml(LONG)}
        filename="a.ts"
        fullscreenable
      />,
    );
    const popup = await openFullscreen();
    const header = popup.querySelector<HTMLElement>(
      '[data-slot="code-block-header"]',
    )!;
    // The code's own box scrolls, inside the block's scroll area, as it did
    // before the view moved into the dialog.
    const scroll = popup.querySelector<HTMLElement>(
      '[data-slot="code-block-scroll"] > [data-slot="code-block-content"]',
    )!;

    expect(getComputedStyle(scroll).overflowY).toBe("auto");
    expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
    // The popup and the viewport hold their size; only the scroll area scrolls.
    expect(popup.scrollHeight).toBe(popup.clientHeight);
    expect(popup.parentElement!.scrollHeight).toBe(
      popup.parentElement!.clientHeight,
    );
    // The scroll area runs from under the header to the frame's bottom edge.
    const frame = popup.getBoundingClientRect();
    const border = Number.parseFloat(getComputedStyle(popup).borderTopWidth);
    expect(header.offsetTop).toBe(0);
    expect(scroll.getBoundingClientRect().bottom).toBeCloseTo(
      frame.bottom - border,
      0,
    );

    scroll.scrollTop = 400;
    expect(scroll.scrollTop).toBe(400);
    expect(header.offsetTop).toBe(0);
  });

  it("stacks above the Dialog it opens from and returns focus to its button", async () => {
    render(
      // Uncontrolled, so an Escape reaching the outer dialog would close it.
      <Dialog defaultOpen title="Outer">
        <CodeBlock code="x" html={toHtml("x")} filename="a.ts" fullscreenable />
      </Dialog>,
    );
    const locator = page.getByRole("button", { name: "Enter fullscreen" });
    await expect.element(locator).toBeInTheDocument();
    // Held as an element: the open view hides the page, so a role query
    // would no longer find the toggle.
    const toggle = locator.element() as HTMLElement;
    const outer = document.querySelector<HTMLElement>(
      '[data-slot="dialog-popup"]',
    )!;
    expect(outer.contains(toggle)).toBe(true);

    await userEvent.click(toggle);
    const fullscreen = page.getByRole("dialog", { name: "a.ts" });
    await expect.element(fullscreen).toBeInTheDocument();
    const popup = fullscreen.element() as HTMLElement;

    // The fullscreen view covers the outer popup's centre…
    const { left, top, width, height } = outer.getBoundingClientRect();
    const centre = document.elementFromPoint(
      left + width / 2,
      top + height / 2,
    );
    expect(popup.contains(centre)).toBe(true);
    // …and its backdrop covers the page in the viewport's inset around it.
    const corner = document.elementFromPoint(4, 4);
    expect(corner).toHaveAttribute("data-slot", "code-block-backdrop");
    // The backdrop itself is lifted to the outer viewport's layer and comes
    // after it, so it paints over the outer popup, not just around it.
    const outerViewport = outer.parentElement!;
    const backdrop = document.querySelector<HTMLElement>(
      '[data-slot="code-block-backdrop"]',
    )!;
    expect(outerViewport).toHaveAttribute("data-slot", "dialog-viewport");
    expect(getComputedStyle(backdrop).zIndex).toBe(
      getComputedStyle(outerViewport).zIndex,
    );
    expect(
      outerViewport.compareDocumentPosition(backdrop) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    // Focus moved into the fullscreen view, so the return below is a real one.
    await expect.element(fullscreen).toHaveFocus();
    expect(toggle).not.toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expect.element(fullscreen).not.toBeInTheDocument();
    // Still open, not merely still mounted while it transitions out.
    expect(outer.isConnected).toBe(true);
    expect(outer).toHaveAttribute("data-open");
    await expect.poll(() => document.activeElement).toBe(toggle);
  });
});

/* Safari does not focus a clicked button. Chromium does, so these clicks cancel
   `mousedown`, which keeps focus on the body as Safari would. */
const keepFocus = (event: React.MouseEvent) => event.preventDefault();

describe("CodeBlock fullscreen focus return without a focused opener", () => {
  it("returns focus to the toggle after a click that left the body focused, and Tab continues from it", async () => {
    render(
      <>
        <CodeBlock
          code="x"
          html={toHtml("x")}
          filename="a.ts"
          fullscreenable
          FullscreenButtonProps={{ onMouseDown: keepFocus }}
        />
        <button type="button">After</button>
      </>,
    );
    const toggle = page
      .getByRole("button", { name: "Enter fullscreen" })
      .element() as HTMLElement;

    await userEvent.click(toggle);
    const fullscreen = page.getByRole("dialog", { name: "a.ts" });
    await expect.element(fullscreen).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await expect.element(fullscreen).not.toBeInTheDocument();
    await expect.poll(() => document.activeElement).toBe(toggle);

    await userEvent.keyboard("{Tab}");
    await expect
      .element(page.getByRole("button", { name: "After" }))
      .toHaveFocus();
  });

  it("returns focus to the toggle when the view opened on mount", async () => {
    const Block = () => {
      const [fullscreen, setFullscreen] = React.useState(true);
      return (
        <CodeBlock
          code="x"
          html={toHtml("x")}
          filename="a.ts"
          fullscreenable
          fullscreen={fullscreen}
          onFullscreenChange={setFullscreen}
        />
      );
    };
    render(<Block />);
    const fullscreen = page.getByRole("dialog", { name: "a.ts" });
    await expect.element(fullscreen).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expect.element(fullscreen).not.toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "Enter fullscreen" }))
      .toHaveFocus();
  });

  it("returns focus to the caller's own control through finalFocus", async () => {
    const Opener = () => {
      const [fullscreen, setFullscreen] = React.useState(false);
      const openerRef = React.useRef<HTMLButtonElement>(null);
      return (
        <>
          <button
            ref={openerRef}
            type="button"
            onMouseDown={keepFocus}
            onClick={() => setFullscreen(true)}
          >
            Open
          </button>
          <CodeBlock
            code="x"
            html={toHtml("x")}
            filename="a.ts"
            fullscreenable
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
            finalFocus={openerRef}
          />
        </>
      );
    };
    render(<Opener />);
    // Held as an element: the open view hides the page from role queries.
    const opener = page
      .getByRole("button", { name: "Open" })
      .element() as HTMLElement;

    await userEvent.click(opener);
    const fullscreen = page.getByRole("dialog", { name: "a.ts" });
    await expect.element(fullscreen).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expect.element(fullscreen).not.toBeInTheDocument();
    await expect.poll(() => document.activeElement).toBe(opener);
  });
});
