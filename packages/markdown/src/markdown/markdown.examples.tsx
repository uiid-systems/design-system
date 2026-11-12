"use client";

import { useEffect, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { Markdown } from "./markdown";
import type { MarkdownOverrides } from "./markdown.types";

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
export const Streaming = ({ reveal = false }: { reveal?: boolean }) => {
  const [length, setLength] = useState(0);
  const done = length >= RESPONSE.length;

  useEffect(() => {
    const id = setTimeout(
      () => setLength(done ? 0 : length + 3),
      done ? 2000 : 40,
    );
    return () => clearTimeout(id);
  }, [length, done]);

  return (
    <Markdown streaming={!done} reveal={reveal}>
      {RESPONSE.slice(0, length)}
    </Markdown>
  );
};

export const StreamingReveal = () => <Streaming reveal />;

const ExternalLink = (props: ComponentPropsWithoutRef<"a">) => (
  <a {...props} target="_blank" rel="noopener noreferrer" />
);

const externalLinks: MarkdownOverrides = { a: ExternalLink };

/** Opens every link in a new tab, through a link override defined once outside render. */
export const ExternalLinks = () => (
  <Markdown overrides={externalLinks}>
    {"Read [the docs](https://example.com) before you start."}
  </Markdown>
);
