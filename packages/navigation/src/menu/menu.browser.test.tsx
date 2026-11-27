import "@uiid/tokens/globals.css";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

/* Select lives in @uiid/forms, which @uiid/navigation must not depend on.
   The test reaches its source by path, so the comparison costs the package
   no dependency and ships nowhere: package builds leave tests out. */
import { Select } from "../../../forms/src/select/select";
import {
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
} from "../../../forms/src/select/subcomponents";
import { Menu } from "./menu";
import type { MenuItemType } from "./menu.types";
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "./subcomponents";

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

/* The text properties a group label's look is made of. `color` is compared
   as computed: both popups are the same neutral Card, so the label's
   inherited `--palette-on-tint` resolves to the same value in each. */
const GROUP_LABEL = [
  "color",
  "font-size",
  "font-weight",
  "line-height",
  "font-family",
];

describe("Menu group label beside Select's", () => {
  it("paints the label the way Select does", async () => {
    render(
      <MenuRoot open modal={false}>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>
              <MenuGroup>
                <MenuGroupLabel>Edit</MenuGroupLabel>
                <MenuItem label="Cut" />
              </MenuGroup>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>,
    );
    render(
      <Select aria-label="Action" backdrop={false} open modal={false}>
        <SelectGroup>
          <SelectGroupLabel>Edit</SelectGroupLabel>
          <SelectItem value="cut" label="Cut" />
        </SelectGroup>
      </Select>,
    );

    const menuLabel = await find('[data-slot="menu-group-label"]');
    const selectLabel = await find('[data-slot="select-group-label"]');

    expect(pick(menuLabel, GROUP_LABEL)).toEqual(
      pick(selectLabel, GROUP_LABEL),
    );
  });
});

describe("Menu checkbox items", () => {
  /* One popup, no hover: every assertion reads layout and computed style of
     rows that are already checked or not, so none depends on timing beyond
     the popup's own open animation, which is awaited. */
  const renderChoices = async () => {
    render(
      <MenuRoot open modal={false}>
        <MenuTrigger>View</MenuTrigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>
              <MenuCheckboxItem label="Status" defaultChecked />
              <MenuCheckboxItem label="Owner" />
              <MenuCheckboxItem label="Name" defaultChecked disabled />
              <MenuItem label="Reset" disabled />
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>,
    );

    const popup = await find('[data-slot="menu-popup"]');
    await expect
      .poll(() => popup.hasAttribute("data-starting-style"))
      .toBe(false);
    await Promise.all(
      popup.getAnimations().map((animation) => animation.finished),
    );
  };

  const parts = (element: HTMLElement) => ({
    label: element.querySelector('[data-slot="list-text-label"]')!,
    content: element.querySelector('[data-slot="list-item"]')!,
    indicator: element.querySelector(
      '[data-slot="menu-checkbox-item-indicator"]',
    )!,
  });

  it("lines up a checked and an unchecked row's labels", async () => {
    await renderChoices();
    const checked = parts(await row("menu-checkbox-item", "Status"));
    const unchecked = parts(await row("menu-checkbox-item", "Owner"));

    const box = (element: Element) => element.getBoundingClientRect();

    expect(box(checked.label).left).toBeCloseTo(box(unchecked.label).left, 1);
    // The unchecked row reserves the indicator's space, so the content
    // beside it ends at the same edge.
    expect(box(checked.content).right).toBeCloseTo(
      box(unchecked.content).right,
      1,
    );
    expect(box(unchecked.indicator).width).toBeGreaterThan(0);
    expect(box(unchecked.indicator).width).toBeCloseTo(
      box(checked.indicator).width,
      1,
    );
  });

  it("shows only a checked row's indicator", async () => {
    await renderChoices();
    const checked = parts(await row("menu-checkbox-item", "Status"));
    const unchecked = parts(await row("menu-checkbox-item", "Owner"));

    expect(style(checked.indicator).visibility).toBe("visible");
    expect(style(unchecked.indicator).visibility).toBe("hidden");
  });

  it("shows a checked, disabled row's indicator, muted with the row", async () => {
    await renderChoices();
    const enabled = await row("menu-checkbox-item", "Status");
    const disabled = await row("menu-checkbox-item", "Name");
    const disabledItem = await row("menu-item", "Reset");

    expect(style(parts(disabled).indicator).visibility).toBe("visible");
    expect(Number(style(disabled).opacity)).toBeLessThan(
      Number(style(enabled).opacity),
    );
    // Dimmed exactly as a disabled MenuItem is.
    expect(style(disabled).opacity).toBe(style(disabledItem).opacity);
  });

  it("pads and rounds a checkbox row like a plain row", async () => {
    await renderChoices();
    const checkbox = await row("menu-checkbox-item", "Owner");
    const plain = await row("menu-item", "Reset");

    expect(pick(checkbox, ROW)).toEqual(pick(plain, ROW));
  });
});
