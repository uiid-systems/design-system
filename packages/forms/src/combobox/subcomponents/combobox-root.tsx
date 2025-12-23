import { Combobox as BaseCombobox } from "@base-ui-components/react/combobox";

import type { SelectMultiple } from "../../select/select.types";

import type { ComboboxRootProps } from "../combobox.types";

export const ComboboxRoot = <Value, Multiple extends SelectMultiple = false>({
  children,
  ...props
}: ComboboxRootProps<Value, Multiple>) => {
  return (
    <BaseCombobox.Root data-slot="combobox-root" {...props}>
      {children}
    </BaseCombobox.Root>
  );
};
ComboboxRoot.displayName = "ComboboxRoot";
