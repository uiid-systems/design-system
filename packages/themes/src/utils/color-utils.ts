/**
 * UIID Color Utilities
 *
 * Provides OKLCH-based color manipulation for theme generation.
 * Pure math — no external dependencies.
 */

// =============================================================================
// OKLCH <-> sRGB Conversion
// =============================================================================

function oklchToOklab(l: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  return [l, c * Math.cos(hRad), c * Math.sin(hRad)];
}

function oklabToOklch(l: number, a: number, b: number): [number, number, number] {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return [l, c, h];
}

function oklabToLinearSrgb(l: number, a: number, b: number): [number, number, number] {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  return [
    +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ];
}

function linearSrgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function linearToSrgb(c: number): number {
  if (c <= 0.0031308) {
    return 12.92 * c;
  }
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function srgbToLinear(c: number): number {
  if (c <= 0.04045) {
    return c / 12.92;
  }
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

function oklchToSrgb(l: number, c: number, h: number): [number, number, number] {
  const [labL, labA, labB] = oklchToOklab(l, c, h);
  const [linR, linG, linB] = oklabToLinearSrgb(labL, labA, labB);
  return [linearToSrgb(linR), linearToSrgb(linG), linearToSrgb(linB)];
}

function srgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const [linR, linG, linB] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const [labL, labA, labB] = linearSrgbToOklab(linR, linG, linB);
  return oklabToOklch(labL, labA, labB);
}

/**
 * Convert OKLCH to hex string.
 */
export function oklchToHex(l: number, c: number, h: number): string {
  const [r, g, b] = oklchToSrgb(l, c, h);

  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const toHex = (v: number) =>
    Math.round(clamp(v) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Parse hex to sRGB [0-1].
 */
export function hexToSrgb(hex: string): [number, number, number] {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) throw new Error(`Invalid hex: ${hex}`);
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
}

// =============================================================================
// Color Scale Generation
// =============================================================================

const LIGHTNESS_SCALE: Record<number, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.78,
  400: 0.68,
  500: 0.58,
  600: 0.48,
  700: 0.39,
  800: 0.30,
  900: 0.22,
  950: 0.14,
};

/**
 * Generate a color scale from OKLCH base values.
 */
export function generateColorScale(
  baseL: number,
  baseC: number,
  baseH: number,
): Array<{ step: number; hex: string; oklch: number[] }> {
  const scale: Array<{ step: number; hex: string; oklch: number[] }> = [];
  const stepKeys = Object.keys(LIGHTNESS_SCALE).map(Number);

  for (const step of stepKeys) {
    const targetL = LIGHTNESS_SCALE[step];

    let adjustedC = baseC;
    if (targetL > 0.9) {
      adjustedC = baseC * 0.3;
    } else if (targetL > 0.8) {
      adjustedC = baseC * 0.5;
    } else if (targetL < 0.25) {
      adjustedC = baseC * 0.6;
    } else if (targetL < 0.35) {
      adjustedC = baseC * 0.8;
    }

    const hex = oklchToHex(targetL, adjustedC, baseH);

    scale.push({
      step,
      hex,
      oklch: [
        Math.round(targetL * 1000) / 1000,
        Math.round(adjustedC * 1000) / 1000,
        Math.round(baseH * 10) / 10,
      ],
    });
  }

  return scale;
}

// =============================================================================
// Color Mixing
// =============================================================================

/**
 * Mix two colors in OKLCH space.
 */
export function computeColorMix(color1: string, color2: string, ratio: number): string {
  const [r1, g1, b1] = hexToSrgb(color1);
  const [r2, g2, b2] = hexToSrgb(color2);

  const [l1, c1, h1] = srgbToOklch(r1, g1, b1);
  const [l2, c2, h2] = srgbToOklch(r2, g2, b2);

  const l = l1 + (l2 - l1) * ratio;
  const c = c1 + (c2 - c1) * ratio;

  const ACHROMATIC = 0.02;
  let h: number;
  if (c1 < ACHROMATIC) {
    h = h2;
  } else if (c2 < ACHROMATIC) {
    h = h1;
  } else {
    let hDiff = h2 - h1;
    if (hDiff > 180) hDiff -= 360;
    if (hDiff < -180) hDiff += 360;
    h = h1 + hDiff * ratio;
    if (h < 0) h += 360;
    if (h >= 360) h -= 360;
  }

  return oklchToHex(l, c, h);
}

// =============================================================================
// Luminance / Contrast
// =============================================================================

/**
 * Relative luminance per WCAG 2.x (sRGB input [0-1]).
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG contrast ratio between two hex colors (always >= 1).
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(...hexToSrgb(hex1));
  const l2 = relativeLuminance(...hexToSrgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
