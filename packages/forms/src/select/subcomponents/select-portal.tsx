import { Select as BaseSelect } from "@base-ui-components/react/select";

import type { SelectPortalProps } from "../select.types";

export const SelectPortal = ({ children, ...props }: SelectPortalProps) => {
  return (
    <BaseSelect.Portal data-slot="select-portal" {...props}>
      {children}
    </BaseSelect.Portal>
  );
};
SelectPortal.displayName = "SelectPortal";
