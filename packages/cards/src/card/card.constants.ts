import type {
  CardColor,
  CardContainerProps,
  CardTitleProps,
} from "./card.types";

export const CARD_DEFAULT_COLOR: CardColor = "neutral";

/** Spaces the header from the body and the body's children from each other. */
export const SHELL_GAP: CardContainerProps["gap"] = 6;

export const SHELL_CONTAINER_PROPS = {
  fullwidth: true,
  p: 6,
  gap: SHELL_GAP,
} satisfies CardContainerProps;

export const SHELL_TITLE_PROPS = {
  size: 4,
  weight: "medium",
} satisfies CardTitleProps;
