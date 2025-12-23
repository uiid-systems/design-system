import { Select as BaseSelect } from "@base-ui-components/react/select";

import type { SelectPositionerProps } from "../select.types";

export const SelectPositioner = ({
  children,
  ...props
}: SelectPositionerProps) => {
  return (
    <BaseSelect.Positioner
      data-slot="select-positioner"
      sideOffset={4}
      {...props}
    >
      <BaseSelect.ScrollUpArrow data-slot="select-scroll-up-arrow" />
      {children}
      <BaseSelect.ScrollDownArrow data-slot="select-scroll-down-arrow" />
    </BaseSelect.Positioner>
  );
};
SelectPositioner.displayName = "SelectPositioner";
