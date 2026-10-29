"use client";

import { useEffect, useState } from "react";

import { Markdown } from "./markdown";

const RESPONSE = `## Streaming markdown

Here is a response with **bold**, *emphasis*, \`inline code\` and a [link](https://example.com).

- A list item
- Another with ~~strikethrough~~

\`\`\`ts
const answer = 42;
\`\`\`

> A closing thought.`;

export const Basic = () => <Markdown>{RESPONSE}</Markdown>;

/** Replays the response a few characters at a time, then pauses and restarts. */
export const Streaming = () => {
  const [length, setLength] = useState(0);
  const done = length >= RESPONSE.length;

  useEffect(() => {
    const id = setTimeout(
      () => setLength(done ? 0 : length + 3),
      done ? 2000 : 40,
    );
    return () => clearTimeout(id);
  }, [length, done]);

  return <Markdown streaming={!done}>{RESPONSE.slice(0, length)}</Markdown>;
};
