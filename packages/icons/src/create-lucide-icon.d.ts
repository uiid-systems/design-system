import type { Icon } from "./icon-type";

/**
 * The SVG children of a lucide icon, one `[element, attributes]` pair each.
 * Structurally lucide's `IconNode`, declared locally so a consumer never needs
 * lucide-react's types to resolve it (TS2742).
 */
type IconNode = [
  elementName:
    | "circle"
    | "ellipse"
    | "g"
    | "line"
    | "path"
    | "polygon"
    | "polyline"
    | "rect",
  attrs: Record<string, string>,
][];

/** Author a custom icon in the lucide style. */
declare const createLucideIcon: (iconName: string, iconNode: IconNode) => Icon;

export default createLucideIcon;
