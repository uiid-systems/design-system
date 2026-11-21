import type { GroupProps, StackProps } from "@uiid/design-system";

export type ShellBodyProps = StackProps;
export type ShellRootProps = GroupProps;
export type ShellInnerProps = StackProps;
export type ShellBarProps = GroupProps;

export type ShellProps = ShellRootProps & {
  /** Laid over the leading edge. Expects a `Sidebar`. */
  sidebar?: React.ReactNode;
  /** Pinned above the page. Expects a `Header`. */
  header?: React.ReactNode;
};
