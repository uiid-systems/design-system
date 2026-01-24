"use client";

import type { ReactNode } from "react";
import type { PreviewConfig, PreviewElement } from "@uiid/registry";

import { Button, ToggleButton } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Checkbox, Form, Input, Select, Switch, Textarea } from "@uiid/forms";
import { Box, Group, Layer, Separator, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

/**
 * Maps component type strings to React components for tree rendering.
 */
const componentMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
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
  elements: Record<string, PreviewElement>
): ReactNode {
  const Component = componentMap[element.type];
  if (!Component) {
    return null;
  }

  const { children: childKeys, ...restProps } = element.props || {};
  const elementChildren = element.children;

  // Render child elements recursively
  let renderedChildren: ReactNode = null;
  if (elementChildren && elementChildren.length > 0) {
    renderedChildren = elementChildren.map((childKey) => {
      const child = elements[childKey];
      if (!child) return null;
      return <span key={childKey}>{renderElement(child, elements)}</span>;
    });
  }

  // Text children from props.children
  const textChildren = typeof childKeys === "string" ? childKeys : null;

  const finalChildren = renderedChildren || textChildren || undefined;

  return <Component {...restProps}>{finalChildren}</Component>;
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
    <Stack gap={6} fullwidth>
      {previews.map((preview) => (
        <Stack key={preview.label} gap={3} fullwidth>
          <Text size={1} shade="muted" weight="bold">
            {preview.label}
          </Text>
          <TreePreview preview={preview} />
        </Stack>
      ))}
    </Stack>
  );
}
