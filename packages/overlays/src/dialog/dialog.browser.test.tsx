import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { Dialog } from "./dialog";
import {
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
  DialogViewport,
} from "./subcomponents";

// The popup composition, its transition tokens and the dialog tokens come
// from the global sheet.
import "@uiid/tokens/globals.css";

/* Runs in a real browser, which resolves the cascade and layout happy-dom
   cannot. The CSS modules load here without the cascade layers a build adds,
   so these prove what the dialog's own rules do, not how they rank against a
   consumer's.

   Boxes are read from `offset*`, which ignore the transform the open
   transition scales through, so no check waits on the animation. */

/* Testing Library marks the page as an act() environment, which suits
   happy-dom. Here the events come from outside React, so act() never wraps
   them and React would warn on every one. */
beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = false;
});

const px = (value: string) => Number.parseFloat(value);

/** A CSS length, such as a token, resolved to pixels by a probe element. */
const toPx = (length: string) => {
  const probe = document.createElement("div");
  probe.style.width = length;
  document.body.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
};

/** Content far taller than the screen, standing in for a code block's frame. */
const TallFrame = () => (
  <div data-testid="frame">
    {Array.from({ length: 200 }, (_, i) => (
      <p key={i}>Line {i}</p>
    ))}
  </div>
);

const UnstyledFull = () => (
  <DialogRoot open>
    <DialogPortal>
      <DialogBackdrop />
      <DialogViewport>
        <DialogPopup unstyled size="full" aria-label="Viewer">
          <TallFrame />
        </DialogPopup>
      </DialogViewport>
    </DialogPortal>
  </DialogRoot>
);

describe("DialogPopup unstyled", () => {
  it("adds no padding, surface, border, radius or shadow of its own", async () => {
    render(<UnstyledFull />);

    const popup = page.getByRole("dialog", { name: "Viewer" });
    await expect.element(popup).toBeInTheDocument();
    const style = getComputedStyle(popup.element());

    for (const side of ["Top", "Right", "Bottom", "Left"] as const) {
      expect(px(style[`padding${side}`])).toBe(0);
      expect(px(style[`border${side}Width`])).toBe(0);
    }
    expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(style.backgroundImage).toBe("none");
    expect(px(style.borderTopLeftRadius)).toBe(0);
    expect(style.boxShadow).toBe("none");
  });

  it("is not a scroll container, and its content starts at its corner", async () => {
    render(<UnstyledFull />);

    const popup = page.getByRole("dialog", { name: "Viewer" });
    await expect.element(popup).toBeInTheDocument();
    const el = popup.element() as HTMLElement;
    const frame = page.getByTestId("frame").element() as HTMLElement;
    const style = getComputedStyle(el);

    expect(style.overflowX).toBe("visible");
    expect(style.overflowY).toBe("visible");
    expect(el.tabIndex).toBe(-1);
    expect(el.querySelector("[tabindex]")).toBeNull();
    expect(frame.parentElement).toBe(el);
    // Both boxes scale from the same transform, so their corners meet even
    // mid-transition.
    const frameBox = frame.getBoundingClientRect();
    const popupBox = el.getBoundingClientRect();
    expect(frameBox.top).toBeCloseTo(popupBox.top, 0);
    expect(frameBox.left).toBeCloseTo(popupBox.left, 0);
    // Taller content spills out of the popup rather than scrolling inside it.
    expect(el.scrollHeight).toBeGreaterThan(el.clientHeight);
  });

  it("fills the viewport at size full, inset by the viewport's padding", async () => {
    render(<UnstyledFull />);

    const popup = page.getByRole("dialog", { name: "Viewer" });
    await expect.element(popup).toBeInTheDocument();
    const el = popup.element() as HTMLElement;
    const viewport = el.parentElement!;
    const inset = toPx("1.5rem");

    expect(el.offsetParent).toBe(viewport);
    expect(el.offsetLeft).toBeCloseTo(inset, 0);
    expect(el.offsetTop).toBeCloseTo(inset, 0);
    expect(el.offsetWidth).toBeCloseTo(viewport.clientWidth - 2 * inset, 0);
    expect(el.offsetHeight).toBeCloseTo(viewport.clientHeight - 2 * inset, 0);
  });

  it("keeps the popup transition", async () => {
    render(<UnstyledFull />);

    const popup = page.getByRole("dialog", { name: "Viewer" });
    await expect.element(popup).toBeInTheDocument();

    expect(getComputedStyle(popup.element()).transitionProperty).toMatch(
      /opacity/,
    );
  });

  it("stacks above the Dialog it opens from and returns focus to its trigger", async () => {
    render(
      <Dialog open title="Outer">
        <DialogRoot>
          <DialogTrigger>Fullscreen</DialogTrigger>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup unstyled size="full" aria-label="Viewer">
                <TallFrame />
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>
      </Dialog>,
    );

    const trigger = page.getByRole("button", { name: "Fullscreen" });
    await userEvent.click(trigger);

    const inner = page.getByRole("dialog", { name: "Viewer" });
    await expect.element(inner).toBeInTheDocument();
    const outer = document.querySelector<HTMLElement>(
      '[data-slot="dialog-popup"]:not([aria-label="Viewer"])',
    )!;
    const { left, top, width, height } = outer.getBoundingClientRect();
    const hit = document.elementFromPoint(left + width / 2, top + height / 2);
    expect(inner.element().contains(hit)).toBe(true);

    await userEvent.keyboard("{Escape}");
    await expect.element(inner).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
  });
});
