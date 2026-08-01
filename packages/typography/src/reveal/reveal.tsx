import { Text } from "../text/text";
import {
  REVEAL_DEFAULT_STAGGER,
  REVEAL_DEFAULT_DURATION,
  REVEAL_DEFAULT_BLUR,
} from "./reveal.constants";
import type { RevealProps } from "./reveal.types";

import styles from "./reveal.module.css";

/** Split keeping trailing whitespace attached so spans wrap like words. */
const splitWords = (text: string) => (text ? text.split(/(?<=\s)/) : []);

export const Reveal = ({
  stagger = REVEAL_DEFAULT_STAGGER,
  duration = REVEAL_DEFAULT_DURATION,
  blur = REVEAL_DEFAULT_BLUR,
  style,
  children,
  ...props
}: RevealProps) => {
  return (
    <Text
      data-slot="reveal"
      style={
        {
          "--reveal-stagger": `${stagger}ms`,
          "--reveal-duration": `${duration}ms`,
          "--reveal-blur": `${blur}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {splitWords(children).map((word, index) => (
        <span
          key={index}
          className={styles["reveal-word"]}
          style={{ "--reveal-index": index } as React.CSSProperties}
        >
          {word}
        </span>
      ))}
    </Text>
  );
};
Reveal.displayName = "Reveal";
