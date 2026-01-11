import { Select as BaseSelect } from "@base-ui/react/select";

import type { SelectRootProps } from "../select.types";

export const SelectRoot = <Value = string,>({
  children,
  ...props
}: SelectRootProps<Value>) => {
  return (
    <BaseSelect.Root data-slot="select-root" {...props}>
      {children}
    </BaseSelect.Root>
  );
};
SelectRoot.displayName = "SelectRoot";
