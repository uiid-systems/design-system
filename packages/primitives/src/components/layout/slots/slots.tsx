import { cloneElement } from "react";
import { Box } from "../box/box";
import { ConditionalRender } from "../conditional-render/conditional-render";

import type { Slot, SlotsProps } from "./slots.types";
import "./slots.styles.css";

export const Slots = ({ before, after, children, ...props }: SlotsProps) => {
  const hasSlot = Boolean(before || after);

  const renderSlot = (slot: Slot | undefined) => {
    if (!slot) return null;
    if (typeof slot === "string" || typeof slot === "number") return slot;
    return cloneElement(slot, slot.props, slot.props.children);
  };

  const beforeElement = renderSlot(before);
  const afterElement = renderSlot(after);

  return (
    <ConditionalRender
      condition={hasSlot}
      wrapper={<Box uiid="slots" {...props} />}
    >
      {beforeElement}
      {children}
      {afterElement}
    </ConditionalRender>
  );
};
Slots.displayName = "Slots";
