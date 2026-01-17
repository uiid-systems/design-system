"use client";

/**
 * Component registry for json-render.
 *
 * Maps json-render component names to actual UIID React components.
 * Each entry receives ComponentRenderProps from the renderer.
 */

import type { ComponentRegistry } from "@json-render/react";

import { Button, ToggleButton } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Checkbox, Input, Select, Switch } from "@uiid/forms";
import { Box, Group, Layer, Separator, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

/**
 * Registry mapping component names to UIID implementations.
 *
 * json-render passes ComponentRenderProps:
 * - element: The parsed JSON element with type and props
 * - children: Rendered child elements (for hasChildren: true components)
 * - onAction: Callback for handling actions
 * - loading: Whether parent is loading
 */
export const registry: ComponentRegistry = {
  // Layout components
  Box: ({ element, children }) => <Box {...element.props}>{children}</Box>,

  Stack: ({ element, children }) => <Stack {...element.props}>{children}</Stack>,

  Group: ({ element, children }) => <Group {...element.props}>{children}</Group>,

  Layer: ({ element, children }) => <Layer {...element.props}>{children}</Layer>,

  Separator: ({ element }) => <Separator {...element.props} />,

  // Button components
  Button: ({ element, children, onAction }) => (
    <Button
      {...element.props}
      onClick={() => {
        if (element.props.action && onAction) {
          onAction(element.props.action);
        }
      }}
    >
      {children || element.props.children}
    </Button>
  ),

  ToggleButton: ({ element, children, onAction }) => (
    <ToggleButton
      {...element.props}
      onPressedChange={() => {
        if (element.props.action && onAction) {
          onAction(element.props.action);
        }
      }}
    >
      {children || element.props.children}
    </ToggleButton>
  ),

  // Form components
  Input: ({ element }) => <Input {...element.props} />,

  Checkbox: ({ element, onAction }) => (
    <Checkbox
      {...element.props}
      onCheckedChange={(checked) => {
        if (element.props.action && onAction) {
          onAction({ ...element.props.action, params: { checked } });
        }
      }}
    />
  ),

  Select: ({ element, onAction }) => (
    <Select
      {...element.props}
      onValueChange={(value) => {
        if (element.props.action && onAction) {
          onAction({ ...element.props.action, params: { value } });
        }
      }}
    />
  ),

  Switch: ({ element, onAction }) => (
    <Switch
      {...element.props}
      onCheckedChange={(checked) => {
        if (element.props.action && onAction) {
          onAction({ ...element.props.action, params: { checked } });
        }
      }}
    />
  ),

  // Typography components
  Text: ({ element, children }) => (
    <Text {...element.props}>{children || element.props.children}</Text>
  ),

  // Card components
  Card: ({ element, children }) => <Card {...element.props}>{children}</Card>,
};
