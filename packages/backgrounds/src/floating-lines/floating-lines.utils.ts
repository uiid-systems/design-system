import type {
  BackgroundFloatingLinesProps,
  WaveConfig,
  WaveType,
} from "./floating-lines.types";

export const getLineCount = (
  waveType: WaveType,
  lineCount: Required<BackgroundFloatingLinesProps>["lineCount"],
  enabledWaves: Required<BackgroundFloatingLinesProps>["enabledWaves"],
): number => {
  if (typeof lineCount === "number") return lineCount;
  if (!enabledWaves.includes(waveType)) return 0;
  const index = enabledWaves.indexOf(waveType);
  return lineCount[index] ?? 6;
};

export const getLineDistance = (
  waveType: WaveType,
  lineDistance: Required<BackgroundFloatingLinesProps>["lineDistance"],
  enabledWaves: Required<BackgroundFloatingLinesProps>["enabledWaves"],
): number => {
  if (typeof lineDistance === "number") return lineDistance;
  if (!enabledWaves.includes(waveType)) return 0.1;
  const index = enabledWaves.indexOf(waveType);
  return lineDistance[index] ?? 0.1;
};

export const getWaveConfig = (
  enabledWaves: Required<BackgroundFloatingLinesProps>["enabledWaves"],
  lineCount: Required<BackgroundFloatingLinesProps>["lineCount"],
  lineDistance: Required<BackgroundFloatingLinesProps>["lineDistance"],
): WaveConfig => {
  const count = (wave: WaveType) =>
    enabledWaves.includes(wave)
      ? getLineCount(wave, lineCount, enabledWaves)
      : 0;

  const distance = (wave: WaveType) =>
    enabledWaves.includes(wave)
      ? getLineDistance(wave, lineDistance, enabledWaves) * 0.01
      : 0.01;

  return {
    topLineCount: count("top"),
    middleLineCount: count("middle"),
    bottomLineCount: count("bottom"),
    topLineDistance: distance("top"),
    middleLineDistance: distance("middle"),
    bottomLineDistance: distance("bottom"),
  };
};
