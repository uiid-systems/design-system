"use client";

import type { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Group, Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";
import { Children, cloneElement, isValidElement, useState } from "react";

import { TOGGLE_GROUP_DEFAULT_SIZE } from "./toggle-group.constants";
import { useToggleIndicator } from "./toggle-group.hooks";
import type { ToggleGroupProps } from "./toggle-group.types";
import { toggleVariants } from "./toggle-group.variants";

import styles from "./toggle-group.module.css";

export const ToggleGroup = ({
  size = TOGGLE_GROUP_DEFAULT_SIZE,
  variant,
  orientation,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: ToggleGroupProps) => {
  const [activeValue, setActiveValue] = useState<string[]>(
    defaultValue ? [...defaultValue] : [],
  );
  const { panelRef, buttonsRef } = useToggleIndicator(
    value,
    activeValue,
    orientation,
  );

  const handleValueChange = (newValue: string[]) => {
    setActiveValue(newValue);
    onValueChange?.(newValue);
  };

  // Clone children and inject ref and className. The size tier is injected
  // here rather than selected for in CSS because `composes` only applies to the
  // class that declares it, and the toggles are consumer-authored elements.
  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement<BaseToggle.Props>(child)) {
      const toggleValue = child.props.value;
      const originalClassName = child.props.className || "";

      return cloneElement<BaseToggle.Props & { ref?: unknown }>(child, {
        className: cx(
          styles["toggle-group-button"],
          toggleVariants({ size }),
          originalClassName,
        ),
        ref: (el: HTMLButtonElement | null) => {
          if (el && toggleValue) {
            buttonsRef.current.set(toggleValue, el);
          }
        },
      });
    }
    return child;
  });

  return (
    <BaseToggleGroup
      ref={panelRef}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className={styles["toggle-group-panel"]}
      data-size={size}
      data-variant={variant}
      data-orientation={orientation}
      render={
        orientation === "vertical" ? <Stack gap={2} /> : <Group gap={2} />
      }
      {...props}
    >
      <div
        data-slot="toggle-group-indicator"
        className={styles["toggle-group-indicator"]}
      />
      {enhancedChildren}
    </BaseToggleGroup>
  );
};
ToggleGroup.displayName = "ToggleGroup";

export { Toggle } from "@base-ui/react/toggle";
