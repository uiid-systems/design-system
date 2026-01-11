"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import type { ComboboxPortalProps } from "../combobox.types";

export const ComboboxPortal = ({ children, ...props }: ComboboxPortalProps) => {
  return (
    <BaseCombobox.Portal data-slot="combobox-portal" {...props}>
      {children}
    </BaseCombobox.Portal>
  );
};
ComboboxPortal.displayName = "ComboboxPortal";
