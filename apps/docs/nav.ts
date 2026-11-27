import type { NavEntry } from "@/lib/nav";

/**
 * Every page the docs app names, in order. The sidebar, the breadcrumbs and
 * the pager are filled from it. A group's label is also its saved open
 * state's id, so renaming a group resets that state for returning readers.
 */
export const NAV: NavEntry[] = [
  { label: "Home", href: "/" },
  { label: "Changelog", href: "/changelog" },
  {
    label: "Layout",
    items: [
      { label: "Box", href: "/layout/box" },
      { label: "Conditional Render", href: "/layout/conditional-render" },
      { label: "Group", href: "/layout/group" },
      { label: "Layer", href: "/layout/layer" },
      { label: "Separator", href: "/layout/separator" },
      { label: "Stack", href: "/layout/stack" },
      { label: "Switch Render", href: "/layout/switch-render" },
    ],
  },
  {
    label: "Typography",
    items: [
      { label: "Number", href: "/typography/number" },
      { label: "Prose", href: "/typography/prose" },
      { label: "Reveal", href: "/typography/reveal" },
      { label: "Shimmer", href: "/typography/shimmer" },
      { label: "Text", href: "/typography/text" },
    ],
  },
  {
    label: "Markdown",
    items: [{ label: "Markdown", href: "/markdown/markdown" }],
  },
  {
    label: "Buttons",
    items: [
      { label: "Button", href: "/buttons/button" },
      { label: "Toggle Button", href: "/buttons/toggle-button" },
    ],
  },
  {
    label: "Lists",
    items: [{ label: "List", href: "/lists/list" }],
  },
  {
    label: "Cards",
    items: [
      { label: "Card", href: "/cards/card" },
      { label: "Collapsible Card", href: "/cards/collapsible-card" },
    ],
  },
  {
    label: "Indicators",
    items: [{ label: "Progress", href: "/indicators/progress" }],
  },
  {
    label: "Overlays",
    items: [
      { label: "Dialog", href: "/overlays/dialog" },
      { label: "Drawer", href: "/overlays/drawer" },
      { label: "Popover", href: "/overlays/popover" },
      { label: "Toast", href: "/overlays/toast" },
      { label: "Tooltip", href: "/overlays/tooltip" },
    ],
  },
  {
    label: "Forms",
    items: [
      { label: "Autocomplete", href: "/forms/autocomplete" },
      { label: "Checkbox", href: "/forms/checkbox" },
      { label: "Checkbox Group", href: "/forms/checkbox-group" },
      { label: "Combobox", href: "/forms/combobox" },
      { label: "Field", href: "/forms/field" },
      { label: "Form", href: "/forms/form" },
      { label: "Input", href: "/forms/input" },
      { label: "Mask Input", href: "/forms/mask-input" },
      { label: "Number Field", href: "/forms/number-field" },
      { label: "Radio", href: "/forms/radio" },
      { label: "Radio Group", href: "/forms/radio-group" },
      { label: "Select", href: "/forms/select" },
      { label: "Slider", href: "/forms/slider" },
      { label: "Switch", href: "/forms/switch" },
      { label: "Textarea", href: "/forms/textarea" },
      { label: "Toggle Group", href: "/forms/toggle-group" },
    ],
  },
];
