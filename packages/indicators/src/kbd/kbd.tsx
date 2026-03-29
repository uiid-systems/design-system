"use client";

import { useEffect, useState } from "react";
import { cx } from "@uiid/utils";

import type { KbdProps } from "./kbd.types";
import { formatKeys, matchesHotkey } from "./kbd.utils";
import styles from "./kbd.module.css";

export const Kbd = ({ className, active, hotkey, ...props }: KbdProps) => {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!hotkey || active !== undefined) return;

    const onDown = (e: KeyboardEvent) => {
      if (matchesHotkey(e, hotkey)) setPressed(true);
    };
    const onUp = () => setPressed(false);
    const onBlur = () => setPressed(false);

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [hotkey, active]);

  const isActive = active ?? pressed;

  return (
    <kbd
      data-slot="kbd"
      data-active={isActive || undefined}
      className={cx(styles["kbd"], className)}
      {...props}
    >
      {hotkey ? formatKeys(hotkey) : null}
    </kbd>
  );
};
Kbd.displayName = "Kbd";
