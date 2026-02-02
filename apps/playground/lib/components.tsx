"use client";

/**
 * Component registry for json-render.
 *
 * Maps json-render component names to actual UIID React components.
 * Each entry receives ComponentRenderProps from the renderer.
 */

import type { ReactNode } from "react";
import type { UITree } from "@json-render/core";
import type { ComponentRegistry } from "@json-render/react";
import { Renderer } from "@json-render/react";

import { Button, ToggleButton } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Checkbox, Form, Input, Select, Switch, Textarea } from "@uiid/forms";
import { Box, Group, Layer, Separator, Stack } from "@uiid/layout";
import { Modal } from "@uiid/overlays";
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
  Box: ({ element, children }) => <Box data-element-key={element.key} {...element.props}>{children}</Box>,

  Stack: ({ element, children }) => <Stack data-element-key={element.key} {...element.props}>{children}</Stack>,

  Group: ({ element, children }) => <Group data-element-key={element.key} {...element.props}>{children}</Group>,

  Layer: ({ element, children }) => <Layer data-element-key={element.key} {...element.props}>{children}</Layer>,

  Separator: ({ element }) => <Separator data-element-key={element.key} {...element.props} />,

  // Button components
  Button: ({ element, children, onAction }) => {
    // Destructure action to prevent it from being spread to the native button
    // React 19 reserves "action" prop for form actions on <button> elements
    const { action, ...props } = element.props;
    return (
      <Button
        data-element-key={element.key}
        {...props}
        onClick={() => {
          if (action && onAction) {
            onAction(action);
          }
        }}
      >
        {children || props.children}
      </Button>
    );
  },

  ToggleButton: ({ element, children, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <ToggleButton
        data-element-key={element.key}
        {...props}
        onPressedChange={() => {
          if (action && onAction) {
            onAction(action);
          }
        }}
      >
        {children || props.children}
      </ToggleButton>
    );
  },

  // Form components
  Form: ({ element, children, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <Form
        data-element-key={element.key}
        {...props}
        onSubmit={(event) => {
          event.preventDefault();
          if (action && onAction) {
            const formData = new FormData(event.currentTarget);
            const data = Object.fromEntries(formData.entries());
            onAction({ ...action, params: { formData: data } });
          }
        }}
      >
        {children}
      </Form>
    );
  },

  Input: ({ element }) => <Input data-element-key={element.key} {...element.props} />,

  Textarea: ({ element }) => <Textarea data-element-key={element.key} {...element.props} />,

  Checkbox: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <Checkbox
        data-element-key={element.key}
        {...props}
        onCheckedChange={(checked) => {
          if (action && onAction) {
            onAction({ ...action, params: { checked } });
          }
        }}
      />
    );
  },

  Select: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <Select
        data-element-key={element.key}
        {...props}
        onValueChange={(value) => {
          if (action && onAction) {
            onAction({ ...action, params: { value } });
          }
        }}
      />
    );
  },

  Switch: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <Switch
        data-element-key={element.key}
        {...props}
        onCheckedChange={(checked) => {
          if (action && onAction) {
            onAction({ ...action, params: { checked } });
          }
        }}
      />
    );
  },

  // Typography components
  Text: ({ element, children }) => (
    <Text data-element-key={element.key} {...element.props}>{children || element.props.children}</Text>
  ),

  // Card components
  Card: ({ element, children }) => {
    // Extract slot props (e.g., __slot_footer) and render them
    const slotProps: Record<string, ReactNode> = {};
    const regularProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(element.props)) {
      if (key.startsWith("__slot_")) {
        const slotName = key.replace("__slot_", "");
        const slotTree = value as { root: string; elements: UITree["elements"] };
        // Render the slot subtree using the same registry
        slotProps[slotName] = (
          <Renderer tree={slotTree} registry={registry} />
        );
      } else {
        regularProps[key] = value;
      }
    }

    return (
      <Card data-element-key={element.key} {...regularProps} {...slotProps}>
        {children}
      </Card>
    );
  },

  // Overlay components
  Modal: ({ element, children }) => (
    <Modal data-element-key={element.key} {...element.props} trigger={children} />
  ),
};
