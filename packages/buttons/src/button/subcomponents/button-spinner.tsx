import { LoadingSpinnerIcon } from "@uiid/icons/loading-spinner";
import { cx, useComposedRefs } from "@uiid/utils";
import { useEffect, useRef, useState } from "react";

import type { ButtonSpinnerProps } from "../button.types";

import styles from "../button.module.css";

/**
 * Mounts the spinner when `loading` turns on and keeps it mounted until its
 * fade-out finishes, so an idle button carries no svg and no animation.
 *
 * Only CSS transitions are awaited. The svg also runs the infinite
 * `rotate-360` animation, whose `finished` never settles — waiting on every
 * animation, as Base UI's `useOpenChangeComplete` does, would never unmount.
 * With no transition to wait for (reduced motion, or a DOM without
 * `getAnimations`), it unmounts on the next frame.
 */
const useSpinnerPresence = (loading: boolean) => {
  const [mounted, setMounted] = useState(loading);
  const ref = useRef<SVGSVGElement>(null);

  if (loading && !mounted) setMounted(true);

  useEffect(() => {
    if (loading || !mounted) return;

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      const transitions = (ref.current?.getAnimations?.() ?? []).filter(
        (animation) => "transitionProperty" in animation,
      );
      Promise.allSettled(transitions.map(({ finished }) => finished)).then(
        () => {
          if (!cancelled) setMounted(false);
        },
      );
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [loading, mounted]);

  return { mounted, ref };
};

export const ButtonSpinner = ({
  loading = false,
  className,
  ref,
  ...props
}: ButtonSpinnerProps) => {
  const presence = useSpinnerPresence(loading);
  const composedRef = useComposedRefs(ref, presence.ref);

  if (!presence.mounted) return null;

  return (
    <LoadingSpinnerIcon
      ref={composedRef}
      data-slot="button-spinner"
      data-loading={loading}
      aria-hidden={!loading}
      aria-label={loading ? "Loading" : undefined}
      {...props}
      /*
       * Merged, not spread over: a caller's `className` would otherwise
       * replace `.button-spinner`, and with it the fade that `useSpinnerPresence`
       * waits on before unmounting.
       */
      className={cx(styles["button-spinner"], className)}
    />
  );
};
ButtonSpinner.displayName = "ButtonSpinner";
