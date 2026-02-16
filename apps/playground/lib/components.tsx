"use client";

/**
 * Component registry for json-render.
 *
 * Maps json-render component names to actual UIID React components.
 * Each entry receives ComponentRenderProps from the renderer.
 */

import type { ComponentType, ReactNode } from "react";
import type { Spec } from "@json-render/core";
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
 * - children: Rendered child elements (for container components)
 * - emit: Callback for emitting named events (resolved to action bindings)
 * - loading: Whether parent is loading
 */
export const registry: ComponentRegistry = {
  // Layout components
  Box: ({ element, children }) => <Box {...element.props}>{children}</Box>,

  Stack: ({ element, children }) => <Stack {...element.props}>{children}</Stack>,

  Group: ({ element, children }) => <Group {...element.props}>{children}</Group>,

  Layer: ({ element, children }) => <Layer {...element.props}>{children}</Layer>,

  Separator: ({ element, children }) => <Separator {...element.props}>{children || element.props.children}</Separator>,

  // Button components
  Button: ({ element, children, emit }) => {
    const { action, ...props } = element.props;
    return (
      <Button
        {...props}
        onClick={() => emit("click")}
      >
        {children}
        {props.children}
      </Button>
    );
  },

  ToggleButton: ({ element, children, emit }) => {
    const { action, ...props } = element.props;
    return (
      <ToggleButton
        {...props}
        onPressedChange={() => emit("click")}
      >
        {children || props.children}
      </ToggleButton>
    );
  },

  // Form components
  Form: ({ element, children, emit }) => {
    const { action, ...props } = element.props;
    return (
      <Form
        {...props}
        onSubmit={(event) => {
          event.preventDefault();
          emit("submit");
        }}
      >
        {children}
      </Form>
    );
  },

  Input: ({ element }) => <Input {...element.props} />,

  Textarea: ({ element }) => <Textarea {...element.props} />,

  Checkbox: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <Checkbox
        {...props}
        onCheckedChange={() => emit("change")}
      />
    );
  },

  Select: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <Select
        {...props}
        onValueChange={() => emit("change")}
      />
    );
  },

  Switch: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <Switch
        {...props}
        onCheckedChange={() => emit("change")}
      />
    );
  },

  Radio: ({ element }) => <Radio {...element.props} />,

  RadioGroup: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <RadioGroup
        {...props}
        onValueChange={() => emit("change")}
      />
    );
  },

  CheckboxGroup: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <CheckboxGroup
        {...props}
        onValueChange={() => emit("change")}
      />
    );
  },

  NumberField: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <NumberField
        {...props}
        onValueChange={() => emit("change")}
      />
    );
  },

  Slider: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <Slider
        {...props}
        onValueChange={() => emit("change")}
      />
    );
  },

  // Typography components
  Text: ({ element, children }) => (
    <Text {...element.props}>{children || element.props.children}</Text>
  ),

  // Card components
  Card: ({ element, children }) => {
    // Extract slot props (e.g., __slot_footer) and render them
    const slotProps: Record<string, ReactNode> = {};
    const regularProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(element.props)) {
      if (key.startsWith("__slot_")) {
        const slotName = key.replace("__slot_", "");
        const slotTree = value as { root: string; elements: Spec["elements"] };
        // Render the slot subtree using the same registry
        slotProps[slotName] = (
          <Renderer spec={slotTree} registry={registry} />
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
      <Card {...regularProps} {...slotProps}>
        {children}
      </Card>
    );
  },

  // Overlay components
  Modal: ({ element, children }) => (
    <Modal {...element.props} trigger={children} />
  ),

  // Icon component (playground-only, for JSON block rendering)
  // Generated JSX converts to direct imports for tree-shaking
  Icon: ({ element }) => {
    const { name, ...props } = element.props;
    const IconComponent = Icons[name as keyof typeof Icons] as LucideIcon | undefined;
    if (!IconComponent) return null;
    return <IconComponent {...props} />;
  },

  // Simple Icon component (for brand icons like Google, GitHub, Apple, etc.)
  // SimpleIcons exports both components (objects) and hex color strings — filter out strings
  SimpleIcon: ({ element }) => {
    const { name, ...props } = element.props;
    const value = SimpleIcons[name as keyof typeof SimpleIcons];
    if (!value || typeof value === "string") return null;
    const IconComponent = value as ComponentType<Record<string, unknown>>;
    return <IconComponent {...props} />;
  },

  // Indicator components
  Alert: ({ element, children }) => (
    <Alert {...element.props}>{children}</Alert>
  ),

  Avatar: ({ element }) => <Avatar {...element.props} />,

  Badge: ({ element, children }) => (
    <Badge {...element.props}>
      {children || element.props.children}
    </Badge>
  ),

  Kbd: ({ element, children }) => (
    <Kbd {...element.props}>
      {children || element.props.children}
    </Kbd>
  ),

  Status: ({ element, children }) => (
    <Status {...element.props}>
      {children || element.props.children}
    </Status>
  ),

  Timeline: ({ element, children }) => (
    <Timeline {...element.props}>{children}</Timeline>
  ),

  Progress: ({ element }) => <Progress {...element.props} />,

  // Interactive components
  Accordion: ({ element, emit }) => {
    const { action, ...props } = element.props;
    return (
      <Accordion
        {...props}
        onValueChange={() => emit("change")}
      />
    );
  },

  // Navigation components
  Breadcrumbs: ({ element }) => <Breadcrumbs {...element.props} />,
};
