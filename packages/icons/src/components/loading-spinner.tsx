export type LoadingSpinnerIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Spins via the `[data-animate="spin"]` rule in `@uiid/tokens`, so it needs
 * `@uiid/tokens/globals.css` — the one stylesheet every uiid component
 * already depends on.
 *
 * The whole `<svg>` turns rather than the inner arc: the backing ring is a
 * symmetric annulus so it looks the same, and Blink composites a transform
 * animation on a real CSS box but leaves SVG child elements on the main
 * thread. The hook is an attribute rather than a class because `className` is
 * spread straight through and would silently overwrite one.
 *
 * @see https://magecdn.com/tools/svg-loaders/270-ring-with-bg/
 */
export const LoadingSpinnerIcon = ({
  size = 14,
  fill = "currentColor",
  ...props
}: LoadingSpinnerIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    data-animate="spin"
    {...props}
  >
    <path
      d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 19a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"
      opacity={0.25}
    />
    <path d="M10.72 19.9a8 8 0 0 1-6.5-9.79 7.77 7.77 0 0 1 6.18-5.95 8 8 0 0 1 9.49 6.52A1.54 1.54 0 0 0 21.38 12h.13a1.37 1.37 0 0 0 1.38-1.54 11 11 0 1 0-12.7 12.39A1.54 1.54 0 0 0 12 21.34a1.47 1.47 0 0 0-1.28-1.44Z" />
  </svg>
);
LoadingSpinnerIcon.displayName = "LoadingSpinnerIcon";
