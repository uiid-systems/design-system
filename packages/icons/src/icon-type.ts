import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

/** Props shared by every icon — structurally lucide's `LucideProps`. */
export type IconProps = Partial<SVGProps<SVGSVGElement>> & {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
};

/**
 * An icon component. Structurally lucide's `LucideIcon`, declared locally rather
 * than re-exported from lucide's own types on purpose: packages that consume
 * `@uiid/icons` do not depend on `lucide-react`, so a published `.d.ts` naming
 * lucide's types is unresolvable for them (TS2742) the moment they annotate or
 * re-export an icon.
 *
 * Mirrored by `icons/icon-type.d.ts`, which the per-icon subpath modules use.
 * The duplication is deliberate — it keeps subpath types resolvable before this
 * package has been built.
 */
export type Icon = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;
