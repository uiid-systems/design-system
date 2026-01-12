export interface BackgroundGradientBlindsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Device pixel ratio override */
  dpr?: number;
  /** Pause the animation */
  paused?: boolean;
  /** Array of hex color strings for the gradient (max 8 colors) */
  gradientColors?: string[];
  /** Rotation angle in degrees */
  angle?: number;
  /** Noise intensity (0-1) */
  noise?: number;
  /** Number of blinds to display */
  blindCount?: number;
  /** Minimum width of each blind in pixels */
  blindMinWidth?: number;
  /** Mouse movement dampening (0 = instant, higher = smoother) */
  mouseDampening?: number;
  /** Mirror the gradient */
  mirrorGradient?: boolean;
  /** Spotlight radius (0-1) */
  spotlightRadius?: number;
  /** Spotlight edge softness (0-2) */
  spotlightSoftness?: number;
  /** Spotlight opacity (0-1) */
  spotlightOpacity?: number;
  /** Amount of distortion applied */
  distortAmount?: number;
  /** Direction of the shine effect */
  shineDirection?: "left" | "right";
  /** CSS mix-blend-mode for the container */
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
}
