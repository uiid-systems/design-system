import { Card, type CardContainerProps } from "@uiid/cards";
import type { PaletteColor } from "@uiid/tokens";

import styles from "./popup-layer.module.css";

export type PopupLayerCardOptions = Pick<
  CardContainerProps,
  "p" | "gap" | "fullwidth"
> & {
  /**
   * Palette hue for the popup surface. Left undefined, `Card` falls back to its
   * own neutral default.
   */
  color?: PaletteColor;
};

/**
 * The surface every picker popup renders as: Select's, Combobox's and
 * Autocomplete's. Each passes this as its Base UI `Popup`'s `render`, beside
 * `popupLayerPopupClassName`, so the three cannot drift apart.
 *
 * The popup is portalled, so no class on the control can reach it — the hue
 * has to arrive as a prop. `Card` already paints the palette, so the treatment
 * is a pass-through.
 *
 * A popup must destructure `p`, `gap` and `fullwidth` and hand them here rather
 * than spread them onto the part: Base UI merges the `render` element's props
 * over the part's, so the defaults below would otherwise win over the caller's.
 */
export const popupLayerCard = ({
  color,
  p = 2,
  gap = 0,
  fullwidth = true,
}: PopupLayerCardOptions = {}) => (
  <Card shadow color={color} p={p} gap={gap} fullwidth={fullwidth} />
);

/** The class the popup surface wears beside `popupLayerCard`. */
export const popupLayerPopupClassName = styles["popup-layer-popup"];
