export type SitemapItem = {
  label: string;
  value: string;
};

export type SitemapGroup = {
  category: string;
  items: SitemapEntry[];
};

export type SitemapEntry = SitemapItem | SitemapGroup;

export const SITEMAP: SitemapItem[] = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

/** Manual order — drives the sidebar nav and the pager sequence */
export const COMPONENTS_SITEMAP: SitemapEntry[] = [
  {
    category: "Layout",
    items: [
      { label: "Box", value: "/layout/box" },
      { label: "Conditional Render", value: "/layout/conditional-render" },
      { label: "Group", value: "/layout/group" },
      { label: "Layer", value: "/layout/layer" },
      { label: "Separator", value: "/layout/separator" },
      { label: "Stack", value: "/layout/stack" },
      { label: "Switch Render", value: "/layout/switch-render" },
    ],
  },
  {
    category: "Typography",
    items: [
      { label: "Number", value: "/typography/number" },
      { label: "Prose", value: "/typography/prose" },
      { label: "Reveal", value: "/typography/reveal" },
      { label: "Text", value: "/typography/text" },
    ],
  },
  {
    category: "Buttons",
    items: [
      { label: "Button", value: "/buttons/button" },
      { label: "Toggle Button", value: "/buttons/toggle-button" },
    ],
  },
  {
    category: "Lists",
    items: [{ label: "List", value: "/lists/list" }],
  },
  {
    category: "Cards",
    items: [{ label: "Card", value: "/cards/card" }],
  },
  {
    category: "Overlays",
    items: [
      { label: "Dialog", value: "/overlays/dialog" },
      { label: "Drawer", value: "/overlays/drawer" },
      { label: "Popover", value: "/overlays/popover" },
      { label: "Toast", value: "/overlays/toast" },
      { label: "Tooltip", value: "/overlays/tooltip" },
    ],
  },
  {
    category: "Forms",
    items: [
      { label: "Autocomplete", value: "/forms/autocomplete" },
      { label: "Checkbox", value: "/forms/checkbox" },
      { label: "Checkbox Group", value: "/forms/checkbox-group" },
      { label: "Combobox", value: "/forms/combobox" },
      { label: "Field", value: "/forms/field" },
      { label: "Form", value: "/forms/form" },
      { label: "Input", value: "/forms/input" },
      { label: "Mask Input", value: "/forms/mask-input" },
      { label: "Number Field", value: "/forms/number-field" },
      { label: "Radio", value: "/forms/radio" },
      { label: "Radio Group", value: "/forms/radio-group" },
      { label: "Select", value: "/forms/select" },
      { label: "Slider", value: "/forms/slider" },
      { label: "Switch", value: "/forms/switch" },
      { label: "Textarea", value: "/forms/textarea" },
      { label: "Toggle Group", value: "/forms/toggle-group" },
    ],
  },
];
