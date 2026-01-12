import { Vector3 } from "three";

export type RgbArray = [number, number, number];

/**
 * Parse hex color string to raw RGB values
 */
function parseHex(hex: string): { r: number; g: number; b: number } {
  let value = hex.trim();

  if (value.startsWith("#")) {
    value = value.slice(1);
  }

  let r = 255;
  let g = 255;
  let b = 255;

  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }

  return { r, g, b };
}

/**
 * Convert hex color to three.js Vector3 (0-1 range)
 */
export function hexToVec3(hex: string): Vector3 {
  const { r, g, b } = parseHex(hex);
  return new Vector3(r / 255, g / 255, b / 255);
}

/**
 * Convert hex color to RGB array (0-255 range)
 */
export function hexToRgb(hex: string): RgbArray {
  const { r, g, b } = parseHex(hex);
  return [r, g, b];
}

/**
 * Convert hex color to normalized RGB array (0-1 range for WebGL)
 */
export function hexToNormalizedRgb(hex: string): RgbArray {
  const { r, g, b } = parseHex(hex);
  return [r / 255, g / 255, b / 255];
}
