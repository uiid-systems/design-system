/**
 * UIID Color Utilities
 *
 * Provides OKLCH-based color manipulation for Style Dictionary transforms.
 * Uses pure JS implementation to avoid external dependencies.
 */

// =============================================================================
// OKLCH <-> sRGB Conversion
// =============================================================================

/**
 * Convert OKLCH to OKLab
 */
function oklchToOklab(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  return [l, c * Math.cos(hRad), c * Math.sin(hRad)];
}

/**
 * Convert OKLab to OKLCH
 */
function oklabToOklch(l, a, b) {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return [l, c, h];
}

/**
 * Convert OKLab to linear sRGB
 */
function oklabToLinearSrgb(l, a, b) {
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

/**
 * Convert linear sRGB to OKLab
 */
function linearSrgbToOklab(r, g, b) {
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

/**
 * Gamma correction: linear to sRGB
 */
function linearToSrgb(c) {
  if (c <= 0.0031308) {
    return 12.92 * c;
  }
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * Gamma correction: sRGB to linear
 */
function srgbToLinear(c) {
  if (c <= 0.04045) {
    return c / 12.92;
  }
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert OKLCH to sRGB [0-1]
 */
function oklchToSrgb(l, c, h) {
  const [labL, labA, labB] = oklchToOklab(l, c, h);
  const [linR, linG, linB] = oklabToLinearSrgb(labL, labA, labB);
  return [linearToSrgb(linR), linearToSrgb(linG), linearToSrgb(linB)];
}

/**
 * Convert sRGB [0-1] to OKLCH
 */
function srgbToOklch(r, g, b) {
  const [linR, linG, linB] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const [labL, labA, labB] = linearSrgbToOklab(linR, linG, linB);
  return oklabToOklch(labL, labA, labB);
}

/**
 * Convert OKLCH to hex string
 */
export function oklchToHex(l, c, h) {
  const [r, g, b] = oklchToSrgb(l, c, h);

  // Clamp to [0, 1] and convert to 0-255
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const toHex = (v) =>
    Math.round(clamp(v) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Parse hex to sRGB [0-1]
 */
function hexToSrgb(hex) {
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

/**
 * Lightness values for an 11-step scale (50-950)
 * Calibrated for good contrast ratios
 */
const LIGHTNESS_SCALE = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.78,
  400: 0.68,
  500: 0.58, // Base color typically around here
  600: 0.48,
  700: 0.39,
  800: 0.30,
  900: 0.22,
  950: 0.14,
};

/**
 * Generate a color scale from OKLCH base values
 *
 * @param {number} baseL - Base lightness (0-1)
 * @param {number} baseC - Base chroma (0-0.4+)
 * @param {number} baseH - Base hue (0-360)
 * @param {number} steps - Number of steps (default 11)
 * @returns {Array<{step: number, hex: string, oklch: number[]}>}
 */
export function generateColorScale(baseL, baseC, baseH, steps = 11) {
  const scale = [];

  // Find which step the base color is closest to
  const stepKeys = Object.keys(LIGHTNESS_SCALE).map(Number);

  for (const step of stepKeys) {
    const targetL = LIGHTNESS_SCALE[step];

    // Adjust chroma based on lightness
    // Chroma typically needs to decrease at very light/dark ends
    let adjustedC = baseC;

    if (targetL > 0.9) {
      // Very light: reduce chroma significantly
      adjustedC = baseC * 0.3;
    } else if (targetL > 0.8) {
      // Light: reduce chroma
      adjustedC = baseC * 0.5;
    } else if (targetL < 0.25) {
      // Very dark: reduce chroma
      adjustedC = baseC * 0.6;
    } else if (targetL < 0.35) {
      // Dark: reduce chroma slightly
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
 * Mix two colors in OKLCH space
 *
 * @param {string} color1 - Hex color
 * @param {string} color2 - Hex color
 * @param {number} ratio - Mix ratio (0 = color1, 1 = color2)
 * @returns {string} Resulting hex color
 */
export function computeColorMix(color1, color2, ratio) {
  const [r1, g1, b1] = hexToSrgb(color1);
  const [r2, g2, b2] = hexToSrgb(color2);

  const [l1, c1, h1] = srgbToOklch(r1, g1, b1);
  const [l2, c2, h2] = srgbToOklch(r2, g2, b2);

  // Interpolate in OKLCH
  const l = l1 + (l2 - l1) * ratio;
  const c = c1 + (c2 - c1) * ratio;

  // Hue interpolation (shortest path)
  let hDiff = h2 - h1;
  if (hDiff > 180) hDiff -= 360;
  if (hDiff < -180) hDiff += 360;
  let h = h1 + hDiff * ratio;
  if (h < 0) h += 360;
  if (h >= 360) h -= 360;

  return oklchToHex(l, c, h);
}

// =============================================================================
// Exports
// =============================================================================

export default {
  oklchToHex,
  generateColorScale,
  computeColorMix,
};
