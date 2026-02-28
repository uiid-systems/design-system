"use client";

import type { Icon } from "@uiid/icons";
import {
  BoxIcon,
  TypeIcon,
  MousePointerClickIcon,
  RectangleHorizontalIcon,
  TextCursorInputIcon,
  LayersIcon,
} from "@uiid/icons";
import { Stack } from "@uiid/layout";
import { List, type ListItemOrGroup } from "@uiid/lists";
import { registry as componentRegistry } from "@uiid/registry";

import type { UISpec } from "@/lib/catalog";
import { useChatStore } from "@/lib/store";

const categoryIcons: Record<string, Icon> = {
  layout: BoxIcon,
  typography: TypeIcon,
  buttons: MousePointerClickIcon,
  cards: RectangleHorizontalIcon,
  forms: TextCursorInputIcon,
  overlays: LayersIcon,
};

function getIconForType(type: string): Icon | undefined {
  const entry = componentRegistry[type as keyof typeof componentRegistry];
  const category = entry?.category;
  return category ? categoryIcons[category] : undefined;
}

function buildListItems(
  tree: UISpec,
  elementKey: string,
  selectedKey: string | null,
  onSelect: (key: string | null) => void,
): ListItemOrGroup[] {
  const element = tree.elements[elementKey] as
    | { type: string; children?: string[] }
    | undefined;
  if (!element) return [];

  if (element.children && element.children.length > 0) {
    return [
      {
        category: element.type,
        description: elementKey,
        icon: getIconForType(element.type),
        collapsible: true,
        items: element.children.flatMap((childKey) =>
          buildListItems(tree, childKey, selectedKey, onSelect),
        ),
      },
    ];
  }

  return [
    {
      label: element.type,
      description: elementKey,
      icon: getIconForType(element.type),
      value: elementKey,
      selected: selectedKey === elementKey,
      onClick: () => onSelect(selectedKey === elementKey ? null : elementKey),
    },
  ];
}

export const TreeNavigator = () => {
  const tree = useChatStore((s) => s.tree);
  const selectedElementKey = useChatStore((s) => s.selectedElementKey);
  const selectElement = useChatStore((s) => s.selectElement);

  if (!tree) return null;

  const items = buildListItems(
    tree,
    tree.root,
    selectedElementKey,
    selectElement,
  );

  return (
    <Stack
      data-slot="tree-navigator"
      render={<nav />}
      ax="stretch"
      minw={320}
      style={{ overflowY: "auto" }}
      br={1}
    >
      <List variant="line" items={items} />
    </Stack>
  );
};
TreeNavigator.displayName = "TreeNavigator";
