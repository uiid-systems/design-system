import { Select as BaseSelect } from "@base-ui/react/select";

import type { SelectMultiple, SelectRootProps } from "../select.types";

export const SelectRoot = <Value, Multiple extends SelectMultiple = false>({
  children,
  ...props
}: SelectRootProps<Value, Multiple>) => {
  return (
    <BaseSelect.Root data-slot="select-root" {...props}>
      {children}
    </BaseSelect.Root>
  );
};
SelectRoot.displayName = "SelectRoot";
