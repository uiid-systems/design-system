import type {
  BackgroundFloatingLinesProps,
  WavePosition,
  WaveType,
} from "./floating-lines.types";

export const MAX_GRADIENT_STOPS = 8;

export const DEFAULT_ENABLED_WAVES: WaveType[] = ["top", "middle", "bottom"];
export const DEFAULT_LINE_COUNT: Required<BackgroundFloatingLinesProps>["lineCount"] =
  [6];
export const DEFAULT_LINE_DISTANCE: Required<BackgroundFloatingLinesProps>["lineDistance"] =
  [5];
export const DEFAULT_TOP_WAVE_POSITION: WavePosition = {
  x: 2.0,
  y: -0.7,
  rotate: -1,
};
export const DEFAULT_MIDDLE_WAVE_POSITION: WavePosition = {
  x: 5.0,
  y: 0.0,
  rotate: 0.2,
};
export const DEFAULT_BOTTOM_WAVE_POSITION: WavePosition = {
  x: 2.0,
  y: -0.7,
  rotate: 0.4,
};
export const DEFAULT_ANIMATION_SPEED = 1;
export const DEFAULT_INTERACTIVE = true;
export const DEFAULT_BEND_RADIUS = 5.0;
export const DEFAULT_BEND_STRENGTH = -0.5;
export const DEFAULT_MOUSE_DAMPING = 0.05;
export const DEFAULT_PARALLAX = true;
export const DEFAULT_PARALLAX_STRENGTH = 0.2;
export const DEFAULT_MIX_BLEND_MODE: React.CSSProperties["mixBlendMode"] =
  "screen";
