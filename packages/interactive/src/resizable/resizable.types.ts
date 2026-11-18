import type {
  GroupProps,
  PanelProps,
  SeparatorProps,
} from "react-resizable-panels";

export interface ResizableProps extends Omit<GroupProps, "children"> {
  /**
   * Layout direction of the panels, as on react-resizable-panels' `Group`.
   * @default "horizontal"
   */
  orientation?: GroupProps["orientation"];
  /** @deprecated Use `orientation` instead. `orientation` wins when both are set. */
  direction?: GroupProps["orientation"];
  /** Panel group children (ResizablePanel and ResizableHandle components) */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export interface ResizablePanelProps extends PanelProps {
  /** Additional CSS class name */
  className?: string;
  /** Panel content */
  children?: React.ReactNode;
}

export interface ResizableHandleProps extends Omit<SeparatorProps, "children"> {
  /**
   * Show a visible grip indicator. Pass `false` for a bare line.
   * @default true
   */
  withHandle?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Handle content (overrides withHandle) */
  children?: React.ReactNode;
}
