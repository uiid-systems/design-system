import { Combobox as BaseCombobox } from "@base-ui-components/react/combobox";

import type { ComboboxEmptyProps } from "../combobox.types";

export const ComboboxEmpty = ({ children, ...props }: ComboboxEmptyProps) => {
  return (
    <BaseCombobox.Empty data-slot="combobox-empty" {...props}>
      {children}
    </BaseCombobox.Empty>
  );
};
ComboboxEmpty.displayName = "ComboboxEmpty";
