"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import { ToggleGroup as BaseToggleGroup } from "@base-ui-components/react/toggle-group";
import type { Toggle as BaseToggle } from "@base-ui-components/react/toggle";

import { Group, Stack } from "@uiid/layout";

import { useToggleIndicator } from "./toggle-group.hooks";
import type { ToggleGroupProps } from "./toggle-group.types";
import styles from "./toggle-group.module.css";

export const ToggleGroup = ({
  size = "md",
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

  const handleValueChange = (
    newValue: string[],
    eventDetails: {
      reason: "none";
      event: Event;
      cancel: () => void;
      allowPropagation: () => void;
      isCanceled: boolean;
      isPropagationAllowed: boolean;
    },
  ) => {
    setActiveValue(newValue);
    onValueChange?.(newValue, eventDetails);
  };

  // Clone children and inject ref and className
  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement<BaseToggle.Props>(child)) {
      const toggleValue = child.props.value;
      const originalClassName = child.props.className || "";

      return cloneElement<BaseToggle.Props & { ref?: unknown }>(child, {
        className: `${styles.Button} ${originalClassName}`.trim(),
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
      data-orientation={orientation}
      render={orientation === "vertical" ? <Stack /> : <Group />}
      {...props}
    >
      <div className={styles.Indicator} />
      {enhancedChildren}
    </BaseToggleGroup>
  );
};
ToggleGroup.displayName = "ToggleGroup";

export { Toggle } from "@base-ui-components/react/toggle";
