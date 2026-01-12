export interface BackgroundLiquidChromeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: string;
  secondaryColor?: string;
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
  mouseIntensity?: number;
}
