"use client";

import { Fragment, type ReactNode } from "react";
import type { PreviewConfig, PreviewElement } from "@uiid/registry";

import { Button, ToggleButton } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Checkbox, Form, Input, Select, Switch, Textarea } from "@uiid/forms";
import { Box, Group, Layer, Separator, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

/**
 * Maps component type strings to React components for tree rendering.
 */
const componentMap: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  Box: Box as React.ComponentType<Record<string, unknown>>,
  Stack: Stack as React.ComponentType<Record<string, unknown>>,
  Group: Group as React.ComponentType<Record<string, unknown>>,
  Layer: Layer as React.ComponentType<Record<string, unknown>>,
  Separator: Separator as React.ComponentType<Record<string, unknown>>,
  Button: Button as React.ComponentType<Record<string, unknown>>,
  ToggleButton: ToggleButton as React.ComponentType<Record<string, unknown>>,
  Form: Form as React.ComponentType<Record<string, unknown>>,
  Input: Input as React.ComponentType<Record<string, unknown>>,
  Textarea: Textarea as React.ComponentType<Record<string, unknown>>,
  Checkbox: Checkbox as React.ComponentType<Record<string, unknown>>,
  Select: Select as React.ComponentType<Record<string, unknown>>,
  Switch: Switch as React.ComponentType<Record<string, unknown>>,
  Text: Text as React.ComponentType<Record<string, unknown>>,
  Card: Card as React.ComponentType<Record<string, unknown>>,
};

/**
 * Recursively renders a PreviewElement tree into live React components.
 */
function renderElement(
  element: PreviewElement,
  elements: Record<string, PreviewElement>,
): ReactNode {
  const Component = componentMap[element.type];
  if (!Component) {
    return null;
  }

  const { children: childKeys, ...restProps } = element.props || {};
  const elementChildren = element.children;

  // Separate slotted vs regular children
  const slottedChildren: Record<string, ReactNode> = {};
  const regularChildren: ReactNode[] = [];

  if (elementChildren && elementChildren.length > 0) {
    for (const childKey of elementChildren) {
      const child = elements[childKey];
      if (!child) continue;

      if (child.slot) {
        // Render into the designated slot prop
        slottedChildren[child.slot] = renderElement(child, elements);
      } else {
        // Regular child
        regularChildren.push(
          <span key={childKey}>{renderElement(child, elements)}</span>,
        );
      }
    }
  }

  // Text children from props.children
  const textChildren = typeof childKeys === "string" ? childKeys : null;

  const finalChildren =
    regularChildren.length > 0 ? regularChildren : textChildren || undefined;

  return (
    <Component {...restProps} {...slottedChildren}>
      {finalChildren}
    </Component>
  );
}

type TreePreviewProps = {
  preview: PreviewConfig;
};

/**
 * Renders a single PreviewConfig tree into live React components.
 */
export function TreePreview({ preview }: TreePreviewProps) {
  const { tree } = preview;
  const rootElement = tree.elements[tree.root];
  if (!rootElement) return null;

  return <>{renderElement(rootElement, tree.elements)}</>;
}

type TreePreviewListProps = {
  previews: PreviewConfig[];
};

/**
 * Renders all preview trees for a component, each with its label.
 */
export function TreePreviewList({ previews }: TreePreviewListProps) {
  return (
    <Stack
      ax="center"
      ay="center"
      gap={3}
      fullheight
      fullwidth
      style={{ minHeight: "16rem" }}
    >
      {previews.map((preview) => (
        <Fragment key={preview.label}>
          {/* <Text size={1} shade="muted" weight="bold">
            {preview.label}
          </Text> */}
          <TreePreview preview={preview} />
        </Fragment>
      ))}
    </Stack>
  );
}
