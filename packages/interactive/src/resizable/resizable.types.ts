import type {
  GroupProps,
  PanelProps,
  SeparatorProps,
} from "react-resizable-panels";

export interface ResizableProps
  extends Omit<GroupProps, "orientation" | "children"> {
  /** Layout direction of the panels */
  direction: "horizontal" | "vertical";
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

export interface ResizableHandleProps
  extends Omit<SeparatorProps, "children"> {
  /** Show a visible grip indicator */
  withHandle?: boolean;
  /** Disable the handle */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Handle content (overrides withHandle) */
  children?: React.ReactNode;
}
