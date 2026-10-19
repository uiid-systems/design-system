import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { CardTitleProps } from "../card.types";
import { isTextContent } from "../card.utils";

/**
 * A plain-text title is the card's `<h3>`. A composed one (an icon or badge
 * beside the text) is block content, which a heading can't hold, so it lays
 * its pieces out as a centred row instead. `render` picks the element either
 * way, and a composed title keeps its row on it — Dialog and Drawer pass their
 * Base UI Title here, so an icon beside the text still lines up.
 */
export const CardTitle = ({ children, render, ...props }: CardTitleProps) => {
  return (
    <Text
      data-slot="card-title"
      render={
        isTextContent(children) ? (
          (render ?? <h3 />)
        ) : (
          <Group ay="center" gap={2} render={render} />
        )
      }
      size={1}
      weight="semibold"
      {...props}
    >
      {children}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
