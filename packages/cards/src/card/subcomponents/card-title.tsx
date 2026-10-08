import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { CardTitleProps } from "../card.types";
import { isTextContent } from "../card.utils";

/**
 * A plain-text title is the card's `<h3>`. A composed one (an icon or badge
 * beside the text) is block content, which a heading can't hold, so it lays
 * its pieces out as a centred row instead. `render` still overrides either.
 */
export const CardTitle = ({ children, ...props }: CardTitleProps) => {
  return (
    <Text
      data-slot="card-title"
      render={isTextContent(children) ? <h3 /> : <Group ay="center" gap={2} />}
      size={1}
      weight="semibold"
      {...props}
    >
      {children}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
