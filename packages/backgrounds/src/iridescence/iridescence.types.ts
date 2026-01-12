export interface BackgroundIridescenceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Hex color string, e.g. "#6AF3FF" */
  color?: string;
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}
