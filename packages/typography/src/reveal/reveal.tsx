"use client";

import { memo, useState } from "react";

import { Text } from "../text/text";
import {
  REVEAL_DEFAULT_STAGGER,
  REVEAL_DEFAULT_DURATION,
  REVEAL_DEFAULT_BLUR,
} from "./reveal.constants";
import type { RevealProps } from "./reveal.types";
import { splitWords } from "./reveal.utils";

import styles from "./reveal.module.css";

type RevealWordProps = {
  word: string;
  delay: number;
  duration: number;
};

/**
 * Timing is captured once, at mount. Changing a running or finished animation's delay or duration
 * retimes it in place, so a later value would hide words already on screen and play them again.
 */
const RevealWord = memo(
  ({ word, delay, duration }: RevealWordProps) => {
    const [timing] = useState(() => ({
      "--reveal-delay": `${delay}ms`,
      "--reveal-duration": `${duration}ms`,
    }));
    return (
      <span
        className={styles["reveal-word"]}
        style={timing as React.CSSProperties}
      >
        {word}
      </span>
    );
  },
  (prev, next) => prev.word === next.word,
);
RevealWord.displayName = "RevealWord";

export const Reveal = ({
  stagger = REVEAL_DEFAULT_STAGGER,
  duration = REVEAL_DEFAULT_DURATION,
  blur = REVEAL_DEFAULT_BLUR,
  style,
  children,
  ...props
}: RevealProps) => {
  const words = splitWords(children);

  // Stagger counts from the first word added since the last render, so each streamed chunk
  // staggers on its own instead of waiting behind every word before it.
  const [batch, setBatch] = useState({ count: words.length, start: 0 });
  if (words.length !== batch.count) {
    setBatch({
      count: words.length,
      start: Math.min(batch.count, words.length),
    });
  }

  return (
    <Text
      data-slot="reveal"
      style={
        {
          textWrap: "wrap",
          "--reveal-blur": `${blur}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {words.map((word, index) => (
        <RevealWord
          key={index}
          word={word}
          delay={Math.max(0, index - batch.start) * stagger}
          duration={duration}
        />
      ))}
    </Text>
  );
};
Reveal.displayName = "Reveal";
