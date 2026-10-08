import type { BuilderMeta, ComponentDoc, PropItem } from "./manifest.types";

/** A union prop in docgen shape: members are literal source text. */
const union = (
  name: string,
  description: string,
  members: readonly (string | number)[],
  defaultValue?: string,
): PropItem => ({
  name,
  required: false,
  description,
  defaultValue: defaultValue === undefined ? null : { value: defaultValue },
  type: {
    name: "enum",
    raw: members.map((m) => JSON.stringify(m)).join(" | "),
    value: members.map((m) => ({ value: JSON.stringify(m) })),
  },
});

const scalar = (
  name: string,
  type: "string" | "number" | "boolean",
  description: string,
): PropItem => ({
  name,
  required: false,
  description,
  defaultValue: null,
  type: { name: type },
});

// Values below are copied from each component's `.types.ts`, `.variants.ts`,
// and `.constants.ts`, and from `packages/utils/src/props/styles/`.

/** `ax.values` in `packages/utils/src/props/styles/layout.ts` */
const JUSTIFY = [
  "center",
  "end",
  "normal",
  "space-around",
  "space-between",
  "space-evenly",
  "start",
  "stretch",
] as const;

/** `ay.values` in `packages/utils/src/props/styles/layout.ts` */
const ALIGN = ["baseline", "center", "end", "start", "stretch"] as const;

/** `PALETTE_HUES` from `@uiid/tokens` */
const PALETTE = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "neutral",
] as const;

/** `size` in `button.variants.ts` and `input.variants.ts` */
const CONTROL_SIZES = ["xsmall", "small", "medium", "large"] as const;

const gap = scalar("gap", "number", "Gap between children, in spacing units");
const p = scalar("p", "number", "Padding on all sides, in spacing units");

export const manifest = {
  Stack: {
    displayName: "Stack",
    description: "Vertical flex container",
    props: {
      gap,
      p,
      // Stack swaps the axes: `ax` is the cross axis of the column.
      ax: union(
        "ax",
        "Horizontal alignment of children (cross axis of the column)",
        ALIGN,
      ),
      ay: union(
        "ay",
        "Vertical alignment of children (main axis of the column)",
        JUSTIFY,
      ),
    },
  },
  Group: {
    displayName: "Group",
    description: "Horizontal flex container",
    props: {
      gap,
      p,
      ax: union(
        "ax",
        "Alignment of children along the main axis (justify-content)",
        JUSTIFY,
      ),
      ay: union(
        "ay",
        "Alignment of children along the cross axis (align-items)",
        ALIGN,
      ),
    },
  },
  Card: {
    displayName: "Card",
    description: "Surface with an optional header, holding content",
    props: {
      title: scalar("title", "string", "Heading shown in the card header"),
      description: scalar(
        "description",
        "string",
        "Supporting text shown under the title",
      ),
      variant: union(
        "variant",
        "Surface treatment — filled by default, `ghost` transparent",
        ["ghost"],
      ),
      color: union(
        "color",
        "Palette hue for the card surface",
        PALETTE,
        "neutral",
      ),
    },
  },
  Text: {
    displayName: "Text",
    description: "Inline text",
    props: {
      children: scalar("children", "string", "Text content"),
      size: union(
        "size",
        "Type scale step, from -1 to 6",
        [-1, 0, 1, 2, 3, 4, 5, 6],
        "0",
      ),
      weight: union("weight", "Font weight", [
        "thin",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
      ]),
      family: union(
        "family",
        "Typeface family",
        ["sans", "serif", "mono"],
        "sans",
      ),
      shade: union("shade", "Foreground color from the shade scale", [
        "background",
        "surface",
        "accent",
        "halftone",
        "muted",
        "foreground",
      ]),
    },
  },
  Button: {
    displayName: "Button",
    description: "Clickable action",
    props: {
      children: scalar("children", "string", "Button label"),
      variant: union(
        "variant",
        "Surface treatment — filled by default, `subtle` low-contrast fill, `ghost` transparent",
        ["subtle", "ghost"],
      ),
      size: union(
        "size",
        "Control size, matches form-control rows",
        CONTROL_SIZES,
        "medium",
      ),
      fullwidth: scalar(
        "fullwidth",
        "boolean",
        "Stretch to fill the container width",
      ),
      disabled: scalar("disabled", "boolean", "Prevent interaction"),
    },
  },
  Input: {
    displayName: "Input",
    description: "Single-line text field with a label",
    props: {
      label: scalar("label", "string", "Field label"),
      description: scalar(
        "description",
        "string",
        "Helper text shown under the control",
      ),
      placeholder: scalar(
        "placeholder",
        "string",
        "Hint shown while the field is empty",
      ),
      size: union(
        "size",
        "Control size, matches form-control rows",
        CONTROL_SIZES,
        "medium",
      ),
      disabled: scalar("disabled", "boolean", "Prevent interaction"),
    },
  },
} satisfies Record<string, ComponentDoc>;

export type ManifestKey = keyof typeof manifest;

export const builderMeta: Record<ManifestKey, BuilderMeta> = {
  Stack: { container: true, defaults: { gap: 2 } },
  Group: { container: true, defaults: { gap: 2 } },
  Card: { container: true, defaults: { title: "Card" } },
  Text: { container: false, defaults: { children: "Text" } },
  Button: { container: false, defaults: { children: "Button" } },
  Input: { container: false, defaults: { label: "Label" } },
};
