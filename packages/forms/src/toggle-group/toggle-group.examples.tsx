"use client";

import { BoldIcon } from "@uiid/icons/bold";
import { ItalicIcon } from "@uiid/icons/italic";
import { MonitorSmartphoneIcon } from "@uiid/icons/monitor-smartphone";
import { MoonIcon } from "@uiid/icons/moon";
import { SunIcon } from "@uiid/icons/sun";
import { UnderlineIcon } from "@uiid/icons/underline";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Toggle, ToggleGroup } from "./toggle-group";
import type { ToggleGroupProps } from "./toggle-group.types";

type Size = NonNullable<ToggleGroupProps["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

export const Default = () => (
  <ToggleGroup defaultValue={["monthly"]}>
    <Toggle value="monthly">Monthly</Toggle>
    <Toggle value="yearly">Yearly</Toggle>
  </ToggleGroup>
);

/* An icon-only group needs a label on each toggle for assistive technology. */
export const WithIcons = () => (
  <ToggleGroup defaultValue={["system"]}>
    <Toggle value="light" aria-label="Light theme">
      <SunIcon />
    </Toggle>
    <Toggle value="dark" aria-label="Dark theme">
      <MoonIcon />
    </Toggle>
    <Toggle value="system" aria-label="Match the system theme">
      <MonitorSmartphoneIcon />
    </Toggle>
  </ToggleGroup>
);

export const Sizes = () => (
  <Stack gap={4} ax="start">
    {SIZES.map((size) => (
      <ToggleGroup key={size} size={size} defaultValue={["monthly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>
    ))}
  </Stack>
);

/* `variant="ghost"` drops the container surface, leaving only the moving indicator. */
export const Ghost = () => (
  <ToggleGroup variant="ghost" defaultValue={["monthly"]}>
    <Toggle value="monthly">Monthly</Toggle>
    <Toggle value="yearly">Yearly</Toggle>
  </ToggleGroup>
);

export const Vertical = () => (
  <ToggleGroup orientation="vertical" defaultValue={["left"]}>
    <Toggle value="left">Left</Toggle>
    <Toggle value="center">Center</Toggle>
    <Toggle value="right">Right</Toggle>
  </ToggleGroup>
);

/* With `multiple`, toggles stop being mutually exclusive. */
export const Multiple = () => (
  <ToggleGroup multiple defaultValue={["bold"]}>
    <Toggle value="bold" aria-label="Bold">
      <BoldIcon />
    </Toggle>
    <Toggle value="italic" aria-label="Italic">
      <ItalicIcon />
    </Toggle>
    <Toggle value="underline" aria-label="Underline">
      <UnderlineIcon />
    </Toggle>
  </ToggleGroup>
);

export const Disabled = () => (
  <Stack gap={4} ax="start">
    <ToggleGroup disabled defaultValue={["monthly"]}>
      <Toggle value="monthly">Monthly</Toggle>
      <Toggle value="yearly">Yearly</Toggle>
    </ToggleGroup>
    <ToggleGroup defaultValue={["monthly"]}>
      <Toggle value="monthly">Monthly</Toggle>
      <Toggle value="yearly" disabled>
        Yearly
      </Toggle>
    </ToggleGroup>
  </Stack>
);

export const Controlled = () => {
  const [value, setValue] = useState<string[]>(["monthly"]);

  return (
    <Stack gap={3} ax="start">
      <ToggleGroup value={value} onValueChange={setValue}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>
      <Text size={-1} shade="muted">
        Pressed: {value.length ? value.join(", ") : "none"}
      </Text>
    </Stack>
  );
};

export const Uncontrolled = () => (
  <ToggleGroup defaultValue={["yearly"]}>
    <Toggle value="monthly">Monthly</Toggle>
    <Toggle value="yearly">Yearly</Toggle>
  </ToggleGroup>
);
