import { cloneElement } from "react";

import { cx } from "../../../utils";
import { Box } from "../box/box";
import { ConditionalRender } from "../conditional-render/conditional-render";

import type { Slot, SlotsProps } from "./slots.types";
import styles from "./slots.module.css";

export const Slots = ({
  before,
  beforeOnClick,
  after,
  afterOnClick,
  className,
  children,
  ...props
}: SlotsProps) => {
  const hasSlot = Boolean(before || after);

  const renderSlot = (slot: Slot | undefined, onClick?: () => void) => {
    if (!slot) return null;
    if (typeof slot === "string" || typeof slot === "number") {
      if (onClick)
        return (
          <span role="button" onClick={onClick}>
            {slot}
          </span>
        );
      return slot;
    }
    const interactiveProps = onClick
      ? { onClick, role: "button", tabIndex: 0 }
      : {};
    return cloneElement(
      slot,
      { ...slot.props, ...interactiveProps },
      slot.props.children,
    );
  };

  const beforeElement = renderSlot(before, beforeOnClick);
  const afterElement = renderSlot(after, afterOnClick);

  return (
    <ConditionalRender
      condition={hasSlot}
      wrapper={
        <Box uiid="slots" className={cx(styles.slots, className)} {...props} />
      }
    >
      {beforeElement}
      {children}
      {afterElement}
    </ConditionalRender>
  );
};
Slots.displayName = "Slots";
