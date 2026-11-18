import type { ComponentType, SVGProps } from "react";

/** Props shared by every icon — structurally lucide's `LucideProps`. */
export type IconProps = Partial<SVGProps<SVGSVGElement>> & {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
};

/**
 * An icon component: anything that renders from `IconProps`. That covers
 * lucide's icons, `LoadingSpinnerIcon` and a consumer's own SVG component.
 * `ref` is part of `IconProps` because React 19 passes it as an ordinary prop,
 * so the type does not require a `forwardRef` component. A component used as
 * an `Icon` should spread the `IconProps` it does not handle onto its `<svg>`,
 * since `icon` slots size, class and hide icons through those props.
 *
 * Declared locally rather than re-exported from lucide's own types on purpose:
 * packages that consume `@uiid/icons` do not depend on `lucide-react`, so a
 * published `.d.ts` naming lucide's types is unresolvable for them (TS2742) the
 * moment they annotate or re-export an icon.
 *
 * Mirrored by `icons/icon-type.d.ts`, which the per-icon subpath modules use.
 * The duplication is deliberate — it keeps subpath types resolvable before this
 * package has been built. `icon-type.test.ts` compiles both.
 */
export type Icon = ComponentType<IconProps>;
