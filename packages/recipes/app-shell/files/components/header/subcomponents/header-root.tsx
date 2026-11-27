import { ShellBar } from "@/components/shell";

import type { HeaderRootProps } from "../header.types";

/**
 * The bar over the page. It renders through `ShellBar`, so it lines up with
 * the sidebar's title beside it. Its two ends sit apart; inside a `Shell` the
 * leading one slides aside for the sidebar.
 */
export const HeaderRoot = ({ children, ...props }: HeaderRootProps) => {
  return (
    <ShellBar
      data-slot="header"
      render={<header />}
      ax="space-between"
      {...props}
    >
      {children}
    </ShellBar>
  );
};
HeaderRoot.displayName = "HeaderRoot";
