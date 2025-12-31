import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import type { TabsRootProps } from "../tabs.types";

export const TabsRoot = ({ children, ...props }: TabsRootProps) => {
  return (
    <BaseTabs.Root data-slot="tabs-root" {...props}>
      {children}
    </BaseTabs.Root>
  );
};
TabsRoot.displayName = "TabsRoot";
