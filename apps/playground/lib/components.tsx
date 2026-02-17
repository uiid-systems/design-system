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
 * Get the element key injected by useEnrichedSpec in page.tsx.
 * Used to stamp data-element-key on DOM nodes for the inspector.
 *
 * At runtime, elements are enriched with a `key` property by useEnrichedSpec,
 * but UIElement's static type doesn't include it. We use `object` as the
 * parameter type so any element is accepted, then cast to extract the key.
 */
const keyOf = (element: object) =>
  (element as unknown as { key?: string }).key;

/**
 * Registry mapping component names to UIID implementations.
 *
 * json-render passes ComponentRenderProps:
 * - element: The parsed JSON element with type and props
 * - children: Rendered child elements (for container components)
 * - emit: Callback for emitting named events (resolved to action bindings)
 * - loading: Whether parent is loading
 *
 * Each entry adds data-element-key for the element inspector overlay.
 */
export const registry: ComponentRegistry = {
  // Layout components
  Box: ({ element, children }) => <Box data-element-key={keyOf(element)} {...element.props}>{children}</Box>,

  Stack: ({ element, children }) => <Stack data-element-key={keyOf(element)} {...element.props}>{children}</Stack>,

  Group: ({ element, children }) => <Group data-element-key={keyOf(element)} {...element.props}>{children}</Group>,

  Layer: ({ element, children }) => <Layer data-element-key={keyOf(element)} {...element.props}>{children}</Layer>,

  Separator: ({ element, children }) => <Separator data-element-key={keyOf(element)} {...element.props}>{children || element.props.children}</Separator>,

  // Button components
  Button: ({ element, children, emit }) => (
    <Button data-element-key={keyOf(element)} {...element.props} onClick={() => emit("click")}>
      {children}
      {element.props.children}
    </Button>
  ),

  ToggleButton: ({ element, children, emit }) => (
    <ToggleButton data-element-key={keyOf(element)} {...element.props} onPressedChange={() => emit("click")}>
      {children || element.props.children}
    </ToggleButton>
  ),

  // Form components
  Form: ({ element, children, emit }) => (
    <Form
      data-element-key={keyOf(element)}
      {...element.props}
      onSubmit={(event) => {
        event.preventDefault();
        emit("submit");
      }}
    >
      {children}
    </Form>
  ),

  Input: ({ element }) => <Input data-element-key={keyOf(element)} {...element.props} />,

  Textarea: ({ element }) => <Textarea data-element-key={keyOf(element)} {...element.props} />,

  Checkbox: ({ element, emit }) => (
    <Checkbox data-element-key={keyOf(element)} {...element.props} onCheckedChange={() => emit("change")} />
  ),

  Select: ({ element, emit }) => (
    <Select data-element-key={keyOf(element)} {...element.props} onValueChange={() => emit("change")} />
  ),

  Switch: ({ element, emit }) => (
    <Switch data-element-key={keyOf(element)} {...element.props} onCheckedChange={() => emit("change")} />
  ),

  Radio: ({ element }) => <Radio data-element-key={keyOf(element)} {...element.props} />,

  RadioGroup: ({ element, emit }) => (
    <RadioGroup data-element-key={keyOf(element)} {...element.props} onValueChange={() => emit("change")} />
  ),

  CheckboxGroup: ({ element, emit }) => (
    <CheckboxGroup data-element-key={keyOf(element)} {...element.props} onValueChange={() => emit("change")} />
  ),

  NumberField: ({ element, emit }) => (
    <NumberField data-element-key={keyOf(element)} {...element.props} onValueChange={() => emit("change")} />
  ),

  Slider: ({ element, emit }) => (
    <Slider data-element-key={keyOf(element)} {...element.props} onValueChange={() => emit("change")} />
  ),

  // Typography components
  Text: ({ element, children }) => (
    <Text data-element-key={keyOf(element)} {...element.props}>{children || element.props.children}</Text>
  ),

  // Card components
  Card: ({ element, children }) => {
    // Extract slot props (e.g., __slot_footer) and render them
    const slotProps: Record<string, ReactNode> = {};
    const regularProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(element.props)) {
      if (key.startsWith("__slot_")) {
        const slotName = key.replace("__slot_", "");
        const slotTree = value as Spec;
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
      <Card data-element-key={keyOf(element)} {...regularProps} {...slotProps}>
        {children}
      </Card>
    );
  },

  // Overlay components
  Modal: ({ element, children }) => (
    <Modal data-element-key={keyOf(element)} {...element.props} trigger={children} />
  ),

  // Icon component (playground-only, for JSON block rendering)
  // Generated JSX converts to direct imports for tree-shaking
  Icon: ({ element }) => {
    const { name, ...props } = element.props;
    const IconComponent = Icons[name as keyof typeof Icons] as LucideIcon | undefined;
    if (!IconComponent) return null;
    return <IconComponent data-element-key={keyOf(element)} {...props} />;
  },

  // Simple Icon component (for brand icons like Google, GitHub, Apple, etc.)
  // SimpleIcons exports both components (objects) and hex color strings — filter out strings
  SimpleIcon: ({ element }) => {
    const { name, ...props } = element.props;
    const value = SimpleIcons[name as keyof typeof SimpleIcons];
    if (!value || typeof value === "string") return null;
    const IconComponent = value as ComponentType<Record<string, unknown>>;
    return <IconComponent data-element-key={keyOf(element)} {...props} />;
  },

  // Indicator components
  Alert: ({ element, children }) => (
    <Alert data-element-key={keyOf(element)} {...element.props}>{children}</Alert>
  ),

  Avatar: ({ element }) => <Avatar data-element-key={keyOf(element)} {...element.props} />,

  Badge: ({ element, children }) => (
    <Badge data-element-key={keyOf(element)} {...element.props}>
      {children || element.props.children}
    </Badge>
  ),

  Kbd: ({ element, children }) => (
    <Kbd data-element-key={keyOf(element)} {...element.props}>
      {children || element.props.children}
    </Kbd>
  ),

  Status: ({ element, children }) => (
    <Status data-element-key={keyOf(element)} {...element.props}>
      {children || element.props.children}
    </Status>
  ),

  Timeline: ({ element, children }) => (
    <Timeline data-element-key={keyOf(element)} {...element.props}>{children}</Timeline>
  ),

  Progress: ({ element }) => <Progress data-element-key={keyOf(element)} {...element.props} />,

  // Interactive components
  Accordion: ({ element, emit }) => (
    <Accordion data-element-key={keyOf(element)} {...element.props} onValueChange={() => emit("change")} />
  ),

  // Navigation components
  Breadcrumbs: ({ element }) => <Breadcrumbs data-element-key={keyOf(element)} {...element.props} />,
};
