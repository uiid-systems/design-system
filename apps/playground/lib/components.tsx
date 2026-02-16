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
import {
  Checkbox,
  CheckboxGroup,
  Form,
  Input,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
} from "@uiid/forms";
import * as Icons from "@uiid/icons";
import type { Icon as LucideIcon } from "@uiid/icons";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import { Alert, Avatar, Badge, Kbd, Progress, Status, Timeline } from "@uiid/indicators";
import { Accordion } from "@uiid/interactive";
import { Breadcrumbs } from "@uiid/navigation";
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

  Separator: ({ element, children }) => <Separator data-element-key={element.key} {...element.props}>{children || element.props.children}</Separator>,

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
        {children}
        {props.children}
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

  Radio: ({ element }) => <Radio data-element-key={element.key} {...element.props} />,

  RadioGroup: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <RadioGroup
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

  CheckboxGroup: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <CheckboxGroup
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

  NumberField: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <NumberField
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

  Slider: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <Slider
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
      } else if (key === "icon" && typeof value === "string") {
        // Handle icon prop as an icon name string
        // Card expects a component reference, not a JSX element
        const IconComponent = Icons[value as keyof typeof Icons] as LucideIcon | undefined;
        if (IconComponent) {
          regularProps.icon = IconComponent;
        }
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

  // Icon component (playground-only, for JSON block rendering)
  // Generated JSX converts to direct imports for tree-shaking
  Icon: ({ element }) => {
    const { name, ...props } = element.props;
    const IconComponent = Icons[name as keyof typeof Icons] as LucideIcon | undefined;
    if (!IconComponent) return null;
    return <IconComponent data-element-key={element.key} {...props} />;
  },

  // Simple Icon component (for brand icons like Google, GitHub, Apple, etc.)
  SimpleIcon: ({ element }) => {
    const { name, ...props } = element.props;
    const IconComponent = SimpleIcons[name as keyof typeof SimpleIcons];
    if (!IconComponent) return null;
    return <IconComponent data-element-key={element.key} {...props} />;
  },

  // Indicator components
  Alert: ({ element, children }) => (
    <Alert data-element-key={element.key} {...element.props}>{children}</Alert>
  ),

  Avatar: ({ element }) => <Avatar data-element-key={element.key} {...element.props} />,

  Badge: ({ element, children }) => (
    <Badge data-element-key={element.key} {...element.props}>
      {children || element.props.children}
    </Badge>
  ),

  Kbd: ({ element, children }) => (
    <Kbd data-element-key={element.key} {...element.props}>
      {children || element.props.children}
    </Kbd>
  ),

  Status: ({ element, children }) => (
    <Status data-element-key={element.key} {...element.props}>
      {children || element.props.children}
    </Status>
  ),

  Timeline: ({ element, children }) => (
    <Timeline data-element-key={element.key} {...element.props}>{children}</Timeline>
  ),

  Progress: ({ element }) => <Progress data-element-key={element.key} {...element.props} />,

  // Interactive components
  Accordion: ({ element, onAction }) => {
    const { action, ...props } = element.props;
    return (
      <Accordion
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

  // Navigation components
  Breadcrumbs: ({ element }) => <Breadcrumbs data-element-key={element.key} {...element.props} />,
};
