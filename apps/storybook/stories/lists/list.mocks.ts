import {
  Star,
  Hammer,
  Bug,
  File,
  Ghost,
  Smartphone,
  Folder,
  FileText,
  Image,
  Code,
} from "@uiid/icons";

import type { ListProps } from "@uiid/design-system";

export const MOCK_ITEMS: ListProps["items"] = [
  { value: "1", label: "Item 1" },
  { value: "2", label: "Item 2" },
  { value: "3", label: "Item 3" },
];

export const MOCK_NESTED: ListProps["items"] = [
  {
    category: "Source",
    collapsible: true,
    icon: Folder,
    items: [
      {
        category: "Components",
        collapsible: true,
        icon: Folder,
        items: [
          { value: "button.tsx", label: "button.tsx", icon: Code },
          {
            value: "card.tsx",
            label: "card.tsx",
            icon: Code,
            selected: true,
            action: "action",
            content: "lorem ipsum",
          },
          {
            category: "Forms",
            collapsible: true,
            icon: Folder,
            items: [
              { value: "input.tsx", label: "input.tsx", icon: Code },
              { value: "select.tsx", label: "select.tsx", icon: Code },
            ],
          },
        ],
      },
      {
        category: "Assets",
        icon: Folder,
        items: [
          { value: "logo.svg", label: "logo.svg", icon: Image },
          { value: "banner.png", label: "banner.png", icon: Image },
        ],
      },
      { value: "index.ts", label: "index.ts", icon: FileText },
    ],
  },
];

export const MOCK_LINKS: ListProps["items"] = [
  {
    category: "Features",
    collapsible: true,
    items: [
      {
        value: "feature",
        label: "feature",
        description: "Description 1",
        icon: Star,
      },
      { value: "fix", label: "fix", icon: Hammer },
      { value: "bug", label: "bug", icon: Bug },
      { value: "docs", label: "docs", icon: File },
      { value: "internal", label: "internal", icon: Ghost },
      { value: "mobile", label: "mobile", icon: Smartphone },
    ],
  },
  {
    category: "Selected items",
    collapsible: true,
    items: [
      { value: "accordion", label: "accordion", selected: true },
      { value: "alert dialog", label: "alert dialog", selected: true },
      { value: "autocomplete", label: "autocomplete", selected: true },
      { value: "avatar", label: "avatar", selected: true },
      { value: "checkbox", label: "checkbox", selected: true },
      { value: "checkbox group", label: "checkbox group", selected: true },
      { value: "collapsible", label: "collapsible", selected: true },
    ],
  },
  {
    category: "Disabled items",
    items: [
      { value: "combobox", label: "combobox", disabled: true },
      { value: "context menu", label: "context menu", disabled: true },
      { value: "dialog", label: "dialog", disabled: true },
      { value: "field", label: "field", disabled: true },
      { value: "fieldset", label: "fieldset", disabled: true },
      { value: "filterable menu", label: "filterable menu", disabled: true },
    ],
  },
];
