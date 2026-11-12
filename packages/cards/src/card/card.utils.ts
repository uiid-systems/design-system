import { resolveStyleProp } from "@uiid/utils";

import type { CardProps } from "./card.types";

/**
 * Whether `node` is plain text — strings, numbers, and the empty values React
 * skips — so it can sit inside a heading. Any element in it is not.
 */
export const isTextContent = (node: React.ReactNode): boolean =>
  Array.isArray(node)
    ? node.every(isTextContent)
    : node === null ||
      node === undefined ||
      typeof node === "string" ||
      typeof node === "number" ||
      typeof node === "boolean";

export type CardPadding = Pick<
  CardProps,
  "p" | "px" | "py" | "pl" | "pr" | "pt" | "pb"
>;

/**
 * Resolves each side of a Card's padding from its sources, highest priority
 * first. A side takes the first source that sets it, so an undefined value
 * falls through to the next source instead of clearing the side. Within one
 * source, `pl`/`pr`/`pt`/`pb` beat `px`/`py`, which beat `p`.
 */
export const resolveCardPadding = (...sources: (CardPadding | undefined)[]) => {
  const first = (read: (source: CardPadding) => number | undefined) =>
    sources
      .map((source) => source && read(source))
      .find((value) => value !== undefined);

  return {
    start: first(({ pl, px, p }) => pl ?? px ?? p),
    end: first(({ pr, px, p }) => pr ?? px ?? p),
    top: first(({ pt, py, p }) => pt ?? py ?? p),
    bottom: first(({ pb, py, p }) => pb ?? py ?? p),
  };
};

/**
 * The inline sides as `--card-padding-inline-start/-end`, painted the way the
 * `pl` and `pr` style props paint them. Only the sides a source set, so an
 * unset side keeps the stylesheet's default; undefined when neither is set.
 */
export const inlinePaddingStyle = ({
  start,
  end,
}: ReturnType<typeof resolveCardPadding>) =>
  start === undefined && end === undefined
    ? undefined
    : ({
        ...(start !== undefined && {
          "--card-padding-inline-start": resolveStyleProp("pl", start),
        }),
        ...(end !== undefined && {
          "--card-padding-inline-end": resolveStyleProp("pr", end),
        }),
      } as React.CSSProperties);
