import "@uiid/tokens/globals.css";
import { render } from "@testing-library/react";
import { Group } from "@uiid/layout";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

/* Select lives in @uiid/forms, which @uiid/navigation must not depend on.
   The test reaches its source by path, so the comparison costs the package
   no dependency and ships nowhere: package builds leave tests out. */
import { Select } from "../../../forms/src/select/select";
import {
  SelectItem,
  SelectSeparator,
} from "../../../forms/src/select/subcomponents";
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

/* Both open at once, unmodal and undimmed, so neither blocks the other. A
   test that hovers renders one at a time, so neither popup can cover a row
   the pointer is aimed at. */
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

   A canvas keeps its last `fillStyle` when handed a color it cannot parse,
   which would quietly measure the wrong color, so each one is checked against
   a sentinel no computed style produces. */
const SENTINEL = "#010203";

const toRgb = (color: string, backdrop = "white") => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  const paint = (value: string) => {
    context.fillStyle = SENTINEL;
    context.fillStyle = value;
    if (context.fillStyle === SENTINEL) {
      throw new Error(`The canvas cannot parse the color "${value}"`);
    }
    context.fillRect(0, 0, 1, 1);
  };
  paint(backdrop);
  paint(color);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

/* The alpha, 0 to 255, a computed color paints with on an empty canvas, so a
   transparent color reads as 0 whatever form it is written in. */
const toAlpha = (color: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.fillStyle = SENTINEL;
  context.fillStyle = color;
  if (context.fillStyle === SENTINEL) {
    throw new Error(`The canvas cannot parse the color "${color}"`);
  }
  context.fillRect(0, 0, 1, 1);
  return context.getImageData(0, 0, 1, 1).data[3]!;
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

/* `color` catches a highlight that repaints the text, as Menu's old inverted
   one did, and the outline keys one that adds a ring; menu.test.tsx checks
   the list colors in the stylesheet text. */
const HIGHLIGHT = [
  "background-color",
  "color",
  "outline-style",
  "outline-width",
  "outline-color",
  "outline-offset",
];

/* Hovers a row until it reports the highlight. `composes-option` has no
   transition, so the row's computed style is final once it does. */
const highlight = async (element: HTMLElement) => {
  await userEvent.hover(element);
  await expect.poll(() => element.hasAttribute("data-highlighted")).toBe(true);
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

  /* One popup at a time, so where the two would land cannot matter. */
  it("highlights a row the way Select does", async () => {
    const menu = renderMenu();
    const menuRow = await row("menu-item", "Edit");
    await highlight(menuRow);
    const menuHighlight = pick(menuRow, HIGHLIGHT);
    menu.unmount();

    renderSelect();
    const selectRow = await row("select-item", "Edit");
    await highlight(selectRow);

    expect(menuHighlight).toEqual(pick(selectRow, HIGHLIGHT));
  });
});

/* The line's look: its fill is the color, its height the thickness, and its
   margins the space it keeps from the rows around it. */
const SEPARATOR = [
  "background-color",
  "height",
  "margin-top",
  "margin-bottom",
  "border-top-width",
  "border-bottom-width",
];

describe("Menu separator beside Select's", () => {
  it("draws the same line", async () => {
    render(
      <Menu
        trigger="Actions"
        items={[
          { label: "Edit", value: "edit" },
          { type: "separator" },
          { label: "Delete", value: "delete" },
        ]}
        backdrop={false}
        RootProps={{ open: true, modal: false }}
      />,
    );
    render(
      <Select
        aria-label="Action"
        placeholder="Choose"
        backdrop={false}
        open
        modal={false}
      >
        <SelectItem value="edit" label="Edit" />
        <SelectSeparator />
        <SelectItem value="delete" label="Delete" />
      </Select>,
    );

    const menu = await find('[data-slot="menu-separator"]');
    const select = await find('[data-slot="select-separator"]');

    expect(menu.getAttribute("role")).toBe("separator");
    expect(style(menu).height).toBe("1px");
    // A visible line: neither white nor transparent, so the equality below
    // cannot pass on two lines that both paint nothing.
    expect(toRgb(style(menu).backgroundColor)).not.toEqual([255, 255, 255]);
    expect(toAlpha(style(menu).backgroundColor)).toBeGreaterThan(0);
    expect(pick(menu, SEPARATOR)).toEqual(pick(select, SEPARATOR));
  });
});

describe("Menu row states", () => {
  it("tints a highlighted row apart from a resting one", async () => {
    renderMenu();
    const popup = await find('[data-slot="menu-popup"]');
    const edit = await row("menu-item", "Edit");
    const surface = style(popup).backgroundColor;
    const seen = (element: Element) =>
      toRgb(style(element).backgroundColor, surface);
    const resting = seen(edit);

    await highlight(edit);

    expect(seen(edit)).not.toEqual(resting);
  });

  it("highlights a disabled row the keyboard lands on like an enabled one", async () => {
    renderMenu();
    const edit = await row("menu-item", "Edit");
    const duplicate = await row("menu-item", "Duplicate");

    await highlight(edit);
    const enabled = pick(edit, HIGHLIGHT);

    await userEvent.keyboard("{ArrowDown}");
    await expect
      .poll(() => duplicate.hasAttribute("data-highlighted"))
      .toBe(true);

    expect(duplicate.hasAttribute("data-disabled")).toBe(true);
    // The same tint as the enabled row, dimmed with the row.
    expect(pick(duplicate, HIGHLIGHT)).toEqual(enabled);
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

  it("keeps the tint on an open submenu's trigger", async () => {
    renderMenu();
    const popup = await find('[data-slot="menu-popup"]');
    const edit = await row("menu-item", "Edit");
    const trigger = await row("submenu-trigger", "Move to");
    const surface = style(popup).backgroundColor;
    const seen = (element: Element) =>
      toRgb(style(element).backgroundColor, surface);
    const resting = seen(edit);

    await highlight(trigger);

    // Moving into the submenu leaves the trigger open but no longer highlighted.
    await userEvent.hover(await row("menu-item", "Inbox"));
    await expect
      .poll(
        () =>
          trigger.hasAttribute("data-popup-open") &&
          !trigger.hasAttribute("data-highlighted"),
      )
      .toBe(true);

    // The tint marks the path into the submenu against a resting row.
    expect(seen(trigger)).not.toEqual(resting);
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

/*
 * Where a submenu lands, which happy-dom cannot lay out. Each test renders one
 * menu tree, opens its submenus by keyboard and measures each popup once its
 * open transition and its positioning have settled.
 */
describe("Menu submenu placement", () => {
  const THREE_LEVELS: MenuItemType[] = [
    { label: "Edit", value: "edit" },
    {
      label: "More",
      value: "more",
      items: [
        { label: "Archive", value: "archive" },
        {
          label: "Share",
          value: "share",
          items: [
            { label: "Email", value: "email" },
            { label: "Copy link", value: "link" },
          ],
        },
      ],
    },
  ];

  /* Subpixel layout and rounding. */
  const TOLERANCE = 1;
  /* A submenu aligns its start with its trigger row's (Base UI's `align`
     "start", no offset); this allows for rounding, not a different row. */
  const ALIGN_TOLERANCE = 2;

  let restore: [number, number];

  beforeEach(() => {
    restore = [window.innerWidth, window.innerHeight];
  });

  afterEach(async () => {
    await page.viewport(...restore);
  });

  const popups = () => [
    ...document.querySelectorAll<HTMLElement>('[data-slot="menu-popup"]'),
  ];

  /* Resolves once `count` popups are open, each past its scale-in and no
     longer moving between two frames. */
  const settled = async (count: number) => {
    await expect.poll(() => popups().length).toBe(count);
    const all = popups();
    await expect
      .poll(() =>
        all.some((popup) => popup.hasAttribute("data-starting-style")),
      )
      .toBe(false);
    await Promise.all(
      all.flatMap((popup) =>
        popup.getAnimations().map((animation) => animation.finished),
      ),
    );

    const boxes = () =>
      JSON.stringify(all.map((popup) => popup.getBoundingClientRect()));
    const frame = () =>
      new Promise((resolve) => requestAnimationFrame(resolve));
    await expect
      .poll(async () => {
        const before = boxes();
        await frame();
        return boxes() === before;
      })
      .toBe(true);

    return all.map((popup) => popup.getBoundingClientRect());
  };

  /* Focuses a submenu trigger, opens its submenu with ArrowRight and returns
     the trigger row. */
  const openSubmenu = async (name: string) => {
    const trigger = await row("submenu-trigger", name);
    trigger.focus();
    await userEvent.keyboard("{ArrowRight}");
    return trigger;
  };

  /*
   * A submenu is anchored to its trigger row, which sits inside the parent
   * popup's padding and border, and the gap to the row is smaller than that
   * inset. So the submenu overlaps its parent popup by a few pixels, the
   * accepted look: these tests assert the side it opens on and its alignment
   * with the row, not that the two popups stay clear of each other.
   */
  it("opens each level of a three-level submenu beside its trigger row", async () => {
    await page.viewport(1280, 800);
    render(
      <Menu
        trigger="Actions"
        items={THREE_LEVELS}
        backdrop={false}
        RootProps={{ open: true, modal: false }}
      />,
    );

    await settled(1);
    const more = await openSubmenu("More");
    await settled(2);
    const share = await openSubmenu("Share");
    const [root, second, third] = await settled(3);

    for (const [parent, trigger, child] of [
      [root!, more.getBoundingClientRect(), second!],
      [second!, share.getBoundingClientRect(), third!],
    ] as const) {
      // On the inline end: clear of the row, reaching past the parent popup...
      expect(child.left).toBeGreaterThanOrEqual(trigger.right - TOLERANCE);
      expect(child.right).toBeGreaterThan(parent.right);
      // ...with its top level with the row's.
      expect(Math.abs(child.top - trigger.top)).toBeLessThanOrEqual(
        ALIGN_TOLERANCE,
      );
    }
  });

  /* The trigger sits at the right edge, so the submenu has no room at its
     parent's inline end and must open on the other side. */
  it("flips a submenu at a 320px viewport rather than overflowing", async () => {
    await page.viewport(320, 640);
    render(
      <Group ax="end" w="full">
        <Menu
          trigger="Actions"
          items={MENU_ITEMS}
          align="end"
          backdrop={false}
          RootProps={{ open: true, modal: false }}
        />
      </Group>,
    );

    await settled(1);
    const moveTo = await openSubmenu("Move to");
    const [root, submenu] = await settled(2);
    const trigger = moveTo.getBoundingClientRect();

    // Inside the viewport...
    expect(submenu!.left).toBeGreaterThanOrEqual(-TOLERANCE);
    expect(submenu!.right).toBeLessThanOrEqual(window.innerWidth + TOLERANCE);
    // ...on the inline start: clear of the row, reaching past the parent popup...
    expect(submenu!.right).toBeLessThanOrEqual(trigger.left + TOLERANCE);
    expect(submenu!.left).toBeLessThan(root!.left);
    // ...with its top level with the row's.
    expect(Math.abs(submenu!.top - trigger.top)).toBeLessThanOrEqual(
      ALIGN_TOLERANCE,
    );
  });
});
