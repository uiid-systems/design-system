import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown, { type Components } from "react-markdown";

import { CodeBlock, CodeInline, Prose } from "@uiid/design-system";
import type { BundledLanguage } from "@uiid/design-system";

const ROOT = path.resolve(process.cwd(), "../..");

const markdownComponents: Components = {
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const code = String(children).replace(/\n$/, "");
    const language = /language-(\w+)/.exec(className ?? "")?.[1];

    if (language || code.includes("\n")) {
      return (
        <CodeBlock code={code} language={language as BundledLanguage} />
      );
    }

    return <CodeInline>{code}</CodeInline>;
  },
};

type MarkdownProps = {
  /** Path to a markdown file, relative to the repo root */
  file: string;
};

/** Renders a repo markdown file inside Prose — the single-source pattern. */
export async function Markdown({ file }: MarkdownProps) {
  const markdown = await fs.readFile(path.join(ROOT, file), "utf-8");

  return (
    <Prose data-slot="readme">
      <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
    </Prose>
  );
}

type ReadmeProps = {
  /** Path to a component within packages, e.g. "buttons/button" */
  of: string;
};

/**
 * Renders a component's package README.md — the same source Storybook
 * renders via its Markdown block.
 */
export function Readme({ of }: ReadmeProps) {
  const [pkg, component] = of.split("/");
  return (
    <Markdown file={path.join("packages", pkg, "src", component, "README.md")} />
  );
}
