"use client";

import type { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Group, Stack } from "@uiid/layout";
import { cxState, useComposedRefs } from "@uiid/utils";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useState,
} from "react";
import type { ReactElement, RefObject } from "react";

import { TOGGLE_GROUP_DEFAULT_SIZE } from "./toggle-group.constants";
import { useToggleIndicator } from "./toggle-group.hooks";
import type {
  ToggleGroupProps,
  ToggleGroupVariants,
} from "./toggle-group.types";
import { toggleGroupVariants, toggleVariants } from "./toggle-group.variants";

import styles from "./toggle-group.module.css";

type ToggleGroupItemProps = {
  child: ReactElement<BaseToggle.Props>;
  size: ToggleGroupVariants["size"];
  buttonsRef: RefObject<Map<string, HTMLButtonElement>>;
};

/**
 * Clones one consumer-authored Toggle to inject the group's ref and className,
 * and renders nothing of its own. The size tier is injected here rather than
 * selected for in CSS because `composes` only applies to the class that
 * declares it.
 *
 * It is a component, rather than a clone inside the group's `Children.map`, so
 * the ref it hands the Toggle can be memoized. React detaches and re-attaches
 * a ref whose identity changes, so a ref rebuilt on every render would run the
 * caller's own ref again each time the selection moved.
 */
const ToggleGroupItem = ({ child, size, buttonsRef }: ToggleGroupItemProps) => {
  const toggleValue = child.props.value;

  // Registers the button for the indicator to measure, and takes it back out
  // when the Toggle unmounts or changes value, so a removed element is never
  // measured.
  const measureRef = useCallback(
    (el: HTMLButtonElement | null) => {
      if (!el || !toggleValue) return;

      const buttons = buttonsRef.current;
      buttons.set(toggleValue, el);

      return () => {
        if (buttons.get(toggleValue) === el) buttons.delete(toggleValue);
      };
    },
    [toggleValue, buttonsRef],
  );
  // The clone's `ref` replaces the child's, so the caller's own ref is
  // composed back in alongside the measuring one.
  const composedRef = useComposedRefs(child.props.ref, measureRef);

  return cloneElement(child, {
    className: cxState(
      styles["toggle-group-button"],
      toggleVariants({ size }),
      child.props.className,
    ),
    ref: composedRef,
  });
};

export const ToggleGroup = <Value extends string = string>({
  size = TOGGLE_GROUP_DEFAULT_SIZE,
  variant,
  fullwidth,
  orientation,
  multiple,
  value,
  defaultValue,
  onValueChange,
  className,
  ref,
  children,
  ...props
}: ToggleGroupProps<Value>) => {
  const [activeValue, setActiveValue] = useState<readonly Value[]>(
    defaultValue ?? [],
  );
  const { panelRef, buttonsRef } = useToggleIndicator(
    value,
    activeValue,
    orientation,
    multiple,
  );
  // The indicator measures through `panelRef`, so a consumer's ref joins it
  // rather than taking its place.
  const composedRef = useComposedRefs(ref, panelRef);

  // A group that starts with no value has nothing for the indicator to sit
  // behind, and a controlled parent can still hand back an empty one.
  const hasValue = (value ?? activeValue).length > 0;

  // The handler runs first so it can cancel: Base UI drops a cancelled change,
  // and the indicator's mirror of the uncontrolled value has to drop it too.
  const handleValueChange: NonNullable<
    ToggleGroupProps<Value>["onValueChange"]
  > = (groupValue, eventDetails) => {
    // A single-selection group that holds a value keeps one. Base UI empties
    // it when the pressed toggle is pressed again, so that change is refused
    // here, for the keyboard as well as the pointer. The consumer's handler
    // never hears of it: a controlled parent that stores what it is handed
    // would empty the group itself, and cancelling cannot stop that.
    if (!multiple && groupValue.length === 0) {
      eventDetails.cancel();
      return;
    }

    onValueChange?.(groupValue, eventDetails);
    if (eventDetails.isCanceled) return;

    setActiveValue(groupValue);
  };

  const enhancedChildren = Children.map(children, (child) =>
    isValidElement<BaseToggle.Props>(child) ? (
      <ToggleGroupItem child={child} size={size} buttonsRef={buttonsRef} />
    ) : (
      child
    ),
  );

  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      ref={composedRef}
      multiple={multiple}
      orientation={orientation}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className={cxState(
        styles["toggle-group-panel"],
        toggleGroupVariants({ fullwidth }),
        className,
      )}
      data-size={size}
      data-variant={variant}
      render={
        orientation === "vertical" ? <Stack gap={2} /> : <Group gap={2} />
      }
      {...props}
    >
      {/*
       * One indicator can only sit behind one toggle, and a `multiple` group
       * can have several pressed at once — the ones it could not reach were
       * being painted as if it had. Multi-select drops it and lets each pressed
       * toggle carry its own background instead.
       */}
      {!multiple && hasValue && (
        <div
          data-slot="toggle-group-indicator"
          className={styles["toggle-group-indicator"]}
        />
      )}
      {enhancedChildren}
    </BaseToggleGroup>
  );
};
ToggleGroup.displayName = "ToggleGroup";

export { Toggle } from "@base-ui/react/toggle";
