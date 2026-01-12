export interface BackgroundAuroraProps
  extends React.HTMLAttributes<HTMLDivElement> {
  colorStops?: [string, string, string];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}
