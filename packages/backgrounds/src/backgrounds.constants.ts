// Primary
export const COLOR_ELECTRIC_BLUE = "#6AF3FF";
export const COLOR_BLACK = "#05131A";
export const COLOR_WHITE = "#FFFFFF";

// Secondary
export const COLOR_SLATE = "#001E2D";
export const COLOR_FOREST = "#004D52";

// Accent
export const COLOR_MIDNIGHT = "#002F46";
export const COLOR_SEA = "#005D8C";
export const COLOR_SKY = "#60C5D9";
export const COLOR_ORCHID = "#D982FF";
export const COLOR_LAVENDER = "#9EA3FF";
export const COLOR_TURQUOISE = "#66EEC1";

// Grouped exports for convenience
export const COLOR_PRIMARY = {
  COLOR_ELECTRIC_BLUE,
  COLOR_BLACK,
  COLOR_WHITE,
} as const;
export const COLOR_SECONDARY = { COLOR_SLATE, COLOR_FOREST } as const;
export const COLOR_ACCENT = {
  COLOR_MIDNIGHT,
  COLOR_SEA,
  COLOR_SKY,
  COLOR_ORCHID,
  COLOR_LAVENDER,
  COLOR_TURQUOISE,
} as const;

// Pre-built gradients for floating lines
export const GRADIENTS = {
  electric: [COLOR_ELECTRIC_BLUE, COLOR_SKY, COLOR_MIDNIGHT],
  ocean: [COLOR_SEA, COLOR_SKY, COLOR_TURQUOISE],
  aurora: [COLOR_ELECTRIC_BLUE, COLOR_LAVENDER, COLOR_ORCHID],
  forest: [COLOR_FOREST, COLOR_SEA, COLOR_TURQUOISE],
  twilight: [COLOR_MIDNIGHT, COLOR_SEA, COLOR_LAVENDER],
  neon: [COLOR_ELECTRIC_BLUE, COLOR_ORCHID, COLOR_TURQUOISE],
} as const;
