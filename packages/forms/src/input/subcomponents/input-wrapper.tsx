"use client";

import { Group, Stack } from "@uiid/layout";
import { cx, isRenderable } from "@uiid/utils";

import {
  INPUT_DEFAULT_ORIENTATION,
  INPUT_SLOT_INTERACTIVE,
} from "../input.constants";
import { inputColorClassName } from "../input.styles";
import type { InputWrapperProps } from "../input.types";
import { hasInputSlots } from "../input.utils";
import { inputWrapperVariants } from "../input.variants";

import styles from "../input.module.css";

const SLOT_BEFORE = "input-before";
const SLOT_AFTER = "input-after";

const INTERACTIVE = INPUT_SLOT_INTERACTIVE.join(", ");

/*
 * A press on plain slot content, or on the surface's own padding, focuses the
 * control, as it would on a bare one. `preventDefault` keeps a control that
 * already has focus from blurring first.
 */
const focusControl = (event: React.MouseEvent<HTMLElement>) => {
  if (event.button !== 0 || !(event.target instanceof Element)) return;
  // React bubbles a press in a portal (a slot's popup) through here although
  // its DOM sits outside the wrapper; that press is the popup's own.
  if (!event.currentTarget.contains(event.target)) return;
  // Only an interactive element inside the wrapper counts: `closest` also
  // reaches ancestors, and a dialog popup carries `tabindex="-1"`.
  const interactive = event.target.closest(INTERACTIVE);
  if (interactive && event.currentTarget.contains(interactive)) return;

  const control = Array.from(event.currentTarget.children).find((child) => {
    const slot = child.getAttribute("data-slot");
    return slot !== SLOT_BEFORE && slot !== SLOT_AFTER;
  });
  if (!(control instanceof HTMLElement)) return;

  event.preventDefault();
  control.focus();
};

/**
 * Paints one field surface around a control and the `before` and `after`
 * slots beside it (`horizontal`) or above and below it (`vertical`), so they
 * share its edge, focus ring and tint. With neither slot it stays in the tree
 * as a `display: contents` box and paints nothing, so the control keeps its
 * own surface and is not remounted when a slot comes or goes.
 *
 * The control must be a direct child, and must drop its own surface while
 * wrapped (`hasInputSlots` tells it when); the wrapper strips nothing from it.
 */
export const InputWrapper = ({
  before,
  after,
  orientation = INPUT_DEFAULT_ORIENTATION,
  size,
  fullwidth,
  variant,
  color,
  disabled,
  className,
  children,
}: InputWrapperProps) => {
  const slotted = hasInputSlots({ before, after });

  const wrapperClassName = slotted
    ? cx(
        styles["input-wrapper"],
        styles["input-edge"],
        inputWrapperVariants({ size, fullwidth, variant }),
        inputColorClassName(color),
        className,
      )
    : cx(styles["input-wrapper-bare"], className);
  const slots = (
    <>
      {isRenderable(before) && (
        <span
          data-slot={SLOT_BEFORE}
          inert={disabled}
          className={styles["input-slot"]}
        >
          {before}
        </span>
      )}
      {children}
      {isRenderable(after) && (
        <span
          data-slot={SLOT_AFTER}
          inert={disabled}
          className={styles["input-slot"]}
        >
          {after}
        </span>
      )}
    </>
  );

  /* One element and child shape in both states, so the control keeps its
     place in the tree, and its focus and text, as a slot comes or goes.
     Horizontal centers the slots beside the control. Vertical stretches them
     across it, so a slot row spans the surface the same way the control does. */
  return orientation === "vertical" ? (
    <Stack
      data-slot="input-wrapper"
      data-orientation={slotted ? "vertical" : undefined}
      onMouseDown={slotted ? focusControl : undefined}
      className={wrapperClassName}
    >
      {slots}
    </Stack>
  ) : (
    <Group
      data-slot="input-wrapper"
      data-orientation={slotted ? "horizontal" : undefined}
      ay="center"
      onMouseDown={slotted ? focusControl : undefined}
      className={wrapperClassName}
    >
      {slots}
    </Group>
  );
};
InputWrapper.displayName = "InputWrapper";
