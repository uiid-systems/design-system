import "@uiid/tokens/globals.css";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
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
   painting it over `backdrop`, so a translucent fill reads as it is seen. */
const toRgb = (color: string, backdrop = "white") => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.fillStyle = backdrop;
  context.fillRect(0, 0, 1, 1);
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
});

describe("Menu row states", () => {
  it("highlights a hovered row clearly against the popup", async () => {
    renderMenu();
    const popup = await find('[data-slot="menu-popup"]');
    const edit = await row("menu-item", "Edit");

    await userEvent.hover(edit);
    await expect.poll(() => edit.hasAttribute("data-highlighted")).toBe(true);

    const surface = toRgb(style(popup).backgroundColor);
    const fill = toRgb(
      style(edit).backgroundColor,
      style(popup).backgroundColor,
    );
    expect(fill).not.toEqual(surface);
    expect(contrast(fill, surface)).toBeGreaterThanOrEqual(3);
  });

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

    await userEvent.hover(trigger);
    await expect
      .poll(() => trigger.hasAttribute("data-highlighted"))
      .toBe(true);
    const highlighted = seen(trigger);

    // Moving into the submenu leaves the trigger open but no longer highlighted.
    await userEvent.hover(await row("menu-item", "Inbox"));
    await expect
      .poll(
        () =>
          trigger.hasAttribute("data-popup-open") &&
          !trigger.hasAttribute("data-highlighted"),
      )
      .toBe(true);

    const open = seen(trigger);
    expect(open).not.toEqual(resting);
    expect(open).not.toEqual(highlighted);
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
