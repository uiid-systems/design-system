import type { ShellProps } from "./shell.types";
import { ShellInner, ShellRoot } from "./subcomponents";

/**
 * The frame of the app: a sidebar on the leading edge, and beside it a header
 * over whatever the page is, usually a `Main`. It only arranges them. What
 * goes in each is passed in, so the shell knows nothing about the sidebar's
 * links or the header's contents. Render it inside `ShellBody`.
 *
 * It finds the three by their `data-slot` to slide them when the sidebar
 * opens and closes; see shell.module.css.
 */
export const Shell = ({ sidebar, header, children, ...props }: ShellProps) => {
  return (
    <ShellRoot {...props}>
      {sidebar}
      <ShellInner>
        {header}
        {children}
      </ShellInner>
    </ShellRoot>
  );
};
Shell.displayName = "Shell";
