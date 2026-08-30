import type { MenuProps } from "./menu.types";

export const MOCK_ITEMS: MenuProps["items"] = [
  { label: "Lorem", value: "item-1" },
  { label: "Lorem ipsum dolor sit amet", value: "item-2" },
  {
    label: "Lorem ipsum",
    value: "item-3",
    items: [
      { label: "Item 3.1", value: "item-3.1" },
      { label: "Item 3.2", value: "item-3.2" },
      { label: "Item 3.3", value: "item-3.3" },
    ],
  },
];
