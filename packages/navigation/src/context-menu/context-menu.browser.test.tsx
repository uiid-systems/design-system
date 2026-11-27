import "@uiid/tokens/globals.css";
import { render } from "@testing-library/react";
import { Card } from "@uiid/cards";
import { Group } from "@uiid/layout";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";

import { MenuItem, MenuPopup, MenuPortal } from "../menu/subcomponents";
import { ContextMenu } from "./context-menu";
import {
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
} from "./subcomponents";

/* These run in a real browser, for what happy-dom cannot lay out: the box the
   trigger leaves its area, and where the popup lands against the pointer.

   The token sheet is imported above because component CSS modules compose
   global classes from it, and nothing else loads it under test. */

beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = false;
});

/* Subpixel layout and rounding. */
const TOLERANCE = 1;

const DESCRIPTION =
  "A sibling with more to say than the card beside it, so the row is taller " +
  "than that card's own content and a flex row stretches it to match.";

/*
 * The measured card sits in a flex row beside a taller one, so as a direct
 * flex item it is stretched to the row's height. A trigger that drew a block
 * box of its own would become the flex item instead and leave the card at its
 * content height, so the two boxes would differ.
 */
const Row = ({ area }: { area: React.ReactNode }) => (
  <Group gap={4}>
    {area}
    <Card title="Sibling" description={DESCRIPTION} />
  </Group>
);

const box = (testId: string) => {
  const { width, height } = document
    .querySelector(`[data-testid="${testId}"]`)!
    .getBoundingClientRect();
  return { width, height };
};

const expectSameBox = (
  actual: { width: number; height: number },
  expected: { width: number; height: number },
) => {
  expect(Math.abs(actual.width - expected.width)).toBeLessThanOrEqual(
    TOLERANCE,
  );
  expect(Math.abs(actual.height - expected.height)).toBeLessThanOrEqual(
    TOLERANCE,
  );
};

describe("ContextMenuTrigger box", () => {
  const bare = () => {
    const { unmount } = render(
      <Row area={<Card title="Project" data-testid="area" />} />,
    );
    const measured = box("area");
    unmount();
    return measured;
  };

  it("leaves a wrapped child's box as it is without the trigger", () => {
    const expected = bare();

    /* The control: a plain block `<div>`, Base UI's trigger element without
       this package's class, does change the card's box, so the row can tell
       a box-drawing wrapper from none. */
    const control = render(
      <Row
        area={
          <div>
            <Card title="Project" data-testid="area" />
          </div>
        }
      />,
    );
    expect(box("area").height).toBeLessThan(expected.height - TOLERANCE);
    control.unmount();

    render(
      <Row
        area={
          <ContextMenuRoot>
            <ContextMenuTrigger>
              <Card title="Project" data-testid="area" />
            </ContextMenuTrigger>
          </ContextMenuRoot>
        }
      />,
    );

    expectSameBox(box("area"), expected);
  });

  it("leaves a rendered child's box as it is without the trigger", () => {
    const expected = bare();

    render(
      <Row
        area={
          <ContextMenuRoot>
            <ContextMenuTrigger
              render={<Card title="Project" data-testid="area" />}
            />
          </ContextMenuRoot>
        }
      />,
    );

    expectSameBox(box("area"), expected);
  });

  it("leaves the box of ContextMenu's children as it is without the menu", () => {
    const expected = bare();

    render(
      <Row
        area={
          <ContextMenu items={[{ label: "Edit", value: "edit" }]}>
            <Card title="Project" data-testid="area" />
          </ContextMenu>
        }
      />,
    );

    expectSameBox(box("area"), expected);
  });
});

/*
 * Where the popup lands. Each test right-clicks a point and measures the
 * popup once its open transition and its positioning have settled.
 */
describe("ContextMenu placement", () => {
  /* Base UI's own context menu offsets, placed bottom-start against a
     zero-size anchor at the pointer: the popup's top is 5px above the
     pointer (`sideOffset` -5) and its left 2px right of it (`alignOffset` 2).
     Menu's `sideOffset={4}` would put the top 4px below and fail. */
  const SIDE_OFFSET = -5;
  const ALIGN_OFFSET = 2;
  const OFFSET_TOLERANCE = 2;
  /* ContextMenuPositioner's `collisionPadding`; Base UI's default is 5. */
  const COLLISION_PADDING = 16;

  let restore: [number, number];

  beforeEach(() => {
    restore = [window.innerWidth, window.innerHeight];
  });

  afterEach(async () => {
    await page.viewport(...restore);
  });

  const renderMenu = () =>
    render(
      <ContextMenuRoot>
        <ContextMenuTrigger>
          <Card title="Project" w="full" h={160} data-testid="area" />
        </ContextMenuTrigger>
        <MenuPortal>
          <ContextMenuPositioner>
            <MenuPopup aria-label="Project actions">
              <MenuItem label="Edit" />
              <MenuItem label="Duplicate" />
              <MenuItem label="Move to another project" />
            </MenuPopup>
          </ContextMenuPositioner>
        </MenuPortal>
      </ContextMenuRoot>,
    );

  /* Right-clicks the area at a viewport point. */
  const rightClick = (x: number, y: number) => {
    document.querySelector('[data-testid="area"]')!.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: x,
        clientY: y,
      }),
    );
  };

  /* Resolves once the popup is open, past its scale-in and no longer moving
     between two frames. */
  const settled = async () => {
    const lookup = () =>
      document.querySelector<HTMLElement>('[data-slot="menu-popup"]');
    await expect.poll(lookup).toBeTruthy();
    const popup = lookup()!;
    expect(popup.getAttribute("role")).toBe("menu");
    await expect
      .poll(() => popup.hasAttribute("data-starting-style"))
      .toBe(false);
    await Promise.all(
      popup.getAnimations().map((animation) => animation.finished),
    );

    const rect = () => JSON.stringify(popup.getBoundingClientRect());
    const frame = () =>
      new Promise((resolve) => requestAnimationFrame(resolve));
    await expect
      .poll(async () => {
        const before = rect();
        await frame();
        return rect() === before;
      })
      .toBe(true);

    return popup.getBoundingClientRect();
  };

  it("opens the popup at the pointer", async () => {
    await page.viewport(1280, 800);
    renderMenu();

    const area = document
      .querySelector('[data-testid="area"]')!
      .getBoundingClientRect();
    const x = Math.round(area.left + 40);
    const y = Math.round(area.top + 40);
    rightClick(x, y);

    const popup = await settled();
    expect(Math.abs(popup.top - (y + SIDE_OFFSET))).toBeLessThanOrEqual(
      OFFSET_TOLERANCE,
    );
    expect(Math.abs(popup.left - (x + ALIGN_OFFSET))).toBeLessThanOrEqual(
      OFFSET_TOLERANCE,
    );
  });

  /* The simple component places its popup through the same positioner. */
  it("opens ContextMenu's popup at the pointer", async () => {
    await page.viewport(1280, 800);
    render(
      <ContextMenu
        items={[
          { label: "Edit", value: "edit" },
          { label: "Duplicate", value: "duplicate" },
        ]}
        PopupProps={{ "aria-label": "Project actions" }}
      >
        <Card title="Project" w="full" h={160} data-testid="area" />
      </ContextMenu>,
    );

    const area = document
      .querySelector('[data-testid="area"]')!
      .getBoundingClientRect();
    const x = Math.round(area.left + 40);
    const y = Math.round(area.top + 40);
    rightClick(x, y);

    const popup = await settled();
    expect(Math.abs(popup.top - (y + SIDE_OFFSET))).toBeLessThanOrEqual(
      OFFSET_TOLERANCE,
    );
    expect(Math.abs(popup.left - (x + ALIGN_OFFSET))).toBeLessThanOrEqual(
      OFFSET_TOLERANCE,
    );
  });

  /* The pointer is near the right edge, so a popup opened at it would
     overflow; it must stay inside the viewport instead. */
  it("stays inside a 320px viewport", async () => {
    await page.viewport(320, 640);
    renderMenu();

    const area = document
      .querySelector('[data-testid="area"]')!
      .getBoundingClientRect();
    rightClick(Math.round(area.right - 4), Math.round(area.top + 40));

    const popup = await settled();
    expect(popup.width).toBeGreaterThan(0);
    expect(popup.left).toBeGreaterThanOrEqual(-TOLERANCE);
    expect(popup.right).toBeLessThanOrEqual(window.innerWidth + TOLERANCE);
    // ...and held off the edge by the wrapper's padding, not Base UI's 5px.
    expect(popup.right).toBeLessThanOrEqual(
      window.innerWidth - COLLISION_PADDING + TOLERANCE,
    );
    expect(popup.top).toBeGreaterThanOrEqual(-TOLERANCE);
    expect(popup.bottom).toBeLessThanOrEqual(window.innerHeight + TOLERANCE);
  });
});
