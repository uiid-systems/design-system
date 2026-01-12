export type WavePosition = {
  x: number;
  y: number;
  rotate: number;
};

export type WaveType = "top" | "middle" | "bottom";

export type WaveConfig = {
  topLineCount: number;
  middleLineCount: number;
  bottomLineCount: number;
  topLineDistance: number;
  middleLineDistance: number;
  bottomLineDistance: number;
};

export type BackgroundFloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: Array<"top" | "middle" | "bottom">;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
};
