import "@uiid/tokens/globals.css";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

/* Select lives in @uiid/forms, which @uiid/navigation must not depend on.
   The test reaches its source by path, so the comparison costs the package
   no dependency and ships nowhere: package builds leave tests out. */
import { Select } from "../../../forms/src/select/select";
import { Menu } from "./menu";
import type { MenuItemType } from "./menu.types";

/* These run in a real browser, for what happy-dom cannot show: the computed
   style of every row state, from the token sheet, the Card the popup renders
   as and the shared `composes-*` classes. Menu rebuilds Select's surface
   rather than importing it, so this is what keeps the two from drifting.

   The token sheet is imported above because component CSS modules compose
   global classes from it, and nothing else loads it under test. */

beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = false;
});

/* A test that picks a scheme sets it on the root, where the token sheet's
   `[data-theme]` rule reads it; the popups portal under it. */
afterEach(() => {
  delete document.documentElement.dataset.theme;
});

const MENU_ITEMS: MenuItemType[] = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate", disabled: true },
  {
    label: "Move to",
    value: "move",
    items: [
      { label: "Inbox", value: "inbox" },
      { label: "Archive", value: "archive" },
    ],
  },
];

const SELECT_ITEMS = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate", disabled: true },
];

/* Both open at once, unmodal and undimmed, so neither blocks the other. */
const renderMenu = () =>
  render(
    <Menu
      trigger="Actions"
      items={MENU_ITEMS}
      backdrop={false}
      RootProps={{ open: true, modal: false }}
    />,
  );

const renderSelect = () =>
  render(
    <Select
      aria-label="Action"
      items={SELECT_ITEMS}
      backdrop={false}
      open
      modal={false}
    />,
  );

const find = async (selector: string) => {
  await expect.poll(() => document.querySelector(selector)).toBeTruthy();
  return document.querySelector(selector) as HTMLElement;
};

/* The row of `slot` whose label is `name`, once the popup has rendered it.
   It matches the label slot, not the row's whole text: a row holds more than
   its label, such as Select's indicator, whose Base UI default `✔️` children
   land in the selected row's `textContent`. */
const row = async (slot: string, name: string) => {
  const lookup = () =>
    [...document.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`)].find(
      (element) =>
        element
          .querySelector('[data-slot="list-text-label"]')
          ?.textContent?.trim() === name,
    );
  await expect.poll(lookup).toBeTruthy();
  return lookup()!;
};

const style = (element: Element) => getComputedStyle(element);

const pick = (element: Element, properties: string[]) => {
  const computed = style(element);
  return Object.fromEntries(
    properties.map((property) => [
      property,
      computed.getPropertyValue(property),
    ]),
  );
};

/* Resolves any computed color (oklch, color-mix, light-dark) to sRGB by
   painting it over `backdrop`, so a translucent fill reads as it is seen.
   `alpha` is an element's opacity, which dims everything it paints. */
const toRgb = (color: string, backdrop = "white", alpha = 1) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.fillStyle = backdrop;
  context.fillRect(0, 0, 1, 1);
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: number[], b: number[]) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

const SURFACE = [
  "background-color",
  "border-top-width",
  "border-top-style",
  "border-top-color",
  "border-radius",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "box-shadow",
];

const ROW = [
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-radius",
];

const HIGHLIGHT = [
  "background-color",
  "outline-style",
  "outline-width",
  "outline-color",
  "outline-offset",
];

const SCHEMES = ["light", "dark"] as const;

/* `composes-option` fades the fill in, so a row is read once its transition
   has run. Reading a style first flushes it, so a pending transition starts.
   A transition cut short by the next hover rejects; that is fine. */
const settle = async (element: Element) => {
  style(element).getPropertyValue("background-color");
  await Promise.all(
    element
      .getAnimations()
      .map((animation) => animation.finished.catch(() => {})),
  );
};

/* Hovers a row until it reports the highlight, and lets its fill settle. */
const highlight = async (element: HTMLElement) => {
  await userEvent.hover(element);
  await expect.poll(() => element.hasAttribute("data-highlighted")).toBe(true);
  await settle(element);
};

/* The contrast of a row's ring against the popup around it and against the
   row's own fill inside it, as seen through the row's opacity. */
const ringContrast = (element: Element, popup: Element) => {
  const surface = style(popup).backgroundColor;
  const computed = style(element);
  const alpha = Number(computed.opacity);
  const ring = toRgb(computed.outlineColor, surface, alpha);
  const fill = toRgb(computed.backgroundColor, surface, alpha);
  return {
    surface: contrast(ring, toRgb(surface)),
    fill: contrast(ring, fill),
  };
};

const expectRing = (element: Element, popup: Element) => {
  const computed = style(element);
  expect(computed.outlineStyle).toBe("solid");
  expect(parseFloat(computed.outlineWidth)).toBeGreaterThan(0);
  // Inset by its own width, so the popup's overflow cannot clip it.
  expect(parseFloat(computed.outlineOffset)).toBe(
    -parseFloat(computed.outlineWidth),
  );

  expect(ringContrast(element, popup).surface).toBeGreaterThanOrEqual(3);
};

describe("Menu beside Select", () => {
  it("draws the same popup surface", async () => {
    renderMenu();
    renderSelect();

    const menu = await find('[data-slot="menu-popup"]');
    const select = await find('[data-slot="select-popup"]');

    expect(pick(menu, SURFACE)).toEqual(pick(select, SURFACE));
  });

  it("pads and rounds a row the same", async () => {
    renderMenu();
    renderSelect();

    const menuRow = await row("menu-item", "Edit");
    const selectRow = await row("select-item", "Edit");

    expect(pick(menuRow, ROW)).toEqual(pick(selectRow, ROW));
  });

  it("dims a disabled row the way Select does", async () => {
    renderMenu();
    renderSelect();

    const enabled = await row("menu-item", "Edit");
    const disabled = await row("menu-item", "Duplicate");
    const selectDisabled = await row("select-item", "Duplicate");

    expect(Number(style(disabled).opacity)).toBeLessThan(
      Number(style(enabled).opacity),
    );
    expect(style(disabled).opacity).toBe(style(selectDisabled).opacity);
  });

  it("highlights a row the way Select does", async () => {
    renderMenu();
    renderSelect();

    const menuRow = await row("menu-item", "Edit");
    await highlight(menuRow);
    const menuHighlight = pick(menuRow, HIGHLIGHT);

    const selectRow = await row("select-item", "Edit");
    await highlight(selectRow);

    expect(menuHighlight).toEqual(pick(selectRow, HIGHLIGHT));
  });
});

/* WCAG 1.4.11 asks 3:1 of a state indicator. The tint alone is too faint, so
   the ring `composes-option` draws on top of it carries the highlight. */
describe.each(SCHEMES)("the highlight indicator, %s", (scheme) => {
  beforeEach(() => {
    document.documentElement.dataset.theme = scheme;
  });

  it("rings a highlighted Select row at 3:1 or better", async () => {
    renderSelect();
    const popup = await find('[data-slot="select-popup"]');
    const edit = await row("select-item", "Edit");

    await highlight(edit);

    expectRing(edit, popup);
    expect(ringContrast(edit, popup).fill).toBeGreaterThanOrEqual(3);
  });

  it("rings a highlighted Menu row at 3:1 or better", async () => {
    renderMenu();
    const popup = await find('[data-slot="menu-popup"]');
    const edit = await row("menu-item", "Edit");

    await highlight(edit);

    expectRing(edit, popup);
    expect(ringContrast(edit, popup).fill).toBeGreaterThanOrEqual(3);
  });

  it("keeps the ring on a disabled Menu row the keyboard lands on", async () => {
    renderMenu();
    const popup = await find('[data-slot="menu-popup"]');
    const edit = await row("menu-item", "Edit");
    const duplicate = await row("menu-item", "Duplicate");

    await highlight(edit);
    const enabled = pick(edit, HIGHLIGHT);

    await userEvent.keyboard("{ArrowDown}");
    await expect
      .poll(() => duplicate.hasAttribute("data-highlighted"))
      .toBe(true);
    await settle(duplicate);

    expect(duplicate.hasAttribute("data-disabled")).toBe(true);
    expect(pick(duplicate, HIGHLIGHT)).toEqual(enabled);
    // Seen through the row's disabled opacity, the ring still clears 3:1.
    expectRing(duplicate, popup);
  });
});

describe("Menu row states", () => {
  it("adds no highlight when the pointer is over a disabled row", async () => {
    renderMenu();
    const disabled = await row("menu-item", "Duplicate");
    const resting = style(disabled).backgroundColor;

    // The row takes no pointer events, so Playwright's hit check is skipped.
    await userEvent.hover(disabled, { force: true });

    expect(style(disabled).pointerEvents).toBe("none");
    expect(disabled.hasAttribute("data-highlighted")).toBe(false);
    expect(style(disabled).backgroundColor).toBe(resting);
  });

  it("marks an open submenu's trigger apart from resting and highlighted rows", async () => {
    renderMenu();
    const popup = await find('[data-slot="menu-popup"]');
    const edit = await row("menu-item", "Edit");
    const trigger = await row("submenu-trigger", "Move to");
    const surface = style(popup).backgroundColor;
    const seen = (element: Element) =>
      toRgb(style(element).backgroundColor, surface);
    const resting = seen(edit);

    await highlight(trigger);
    expect(style(trigger).outlineStyle).toBe("solid");

    // Moving into the submenu leaves the trigger open but no longer highlighted.
    await userEvent.hover(await row("menu-item", "Inbox"));
    await expect
      .poll(
        () =>
          trigger.hasAttribute("data-popup-open") &&
          !trigger.hasAttribute("data-highlighted"),
      )
      .toBe(true);
    await settle(trigger);

    // It keeps the tint, which marks it against a resting row, and drops the
    // ring, which marks it apart from the highlighted one.
    expect(seen(trigger)).not.toEqual(resting);
    expect(style(trigger).outlineStyle).toBe("none");
  });

  it("draws the submenu chevron at the row's far edge", async () => {
    renderMenu();
    const popup = await find('[data-slot="menu-popup"]');
    const trigger = await row("submenu-trigger", "Move to");
    const chevron = trigger.querySelector('[data-slot="submenu-chevron"]')!;

    // The popup scales in on open; measure once it has settled.
    await expect
      .poll(() => popup.hasAttribute("data-starting-style"))
      .toBe(false);
    await Promise.all(
      popup.getAnimations().map((animation) => animation.finished),
    );

    const rowBox = trigger.getBoundingClientRect();
    const chevronBox = chevron.getBoundingClientRect();
    const paddingEnd = parseFloat(style(trigger).paddingRight);

    expect(chevronBox.width).toBeGreaterThan(0);
    expect(rowBox.right - chevronBox.right).toBeCloseTo(paddingEnd, 0);
  });
});
