import fs from "node:fs/promises";
import path from "node:path";

import { CodePreview, highlight, Stack, Text } from "@uiid/design-system";

import { slugify } from "./slugify";

const PACKAGES_DIR = path.resolve(process.cwd(), "../../packages");

const LANGUAGE = "tsx";

const EXPORT_PATTERN = /^export const /m;

/** Extracts a named export's source from a component's examples file. */
async function getExampleSource(of: string, name: string) {
  const [pkg, component] = of.split("/");
  const file = path.join(
    PACKAGES_DIR,
    pkg,
    "src",
    component,
    `${component}.examples.tsx`,
  );
  const source = await fs.readFile(file, "utf-8");

  const start = source.search(new RegExp(`^export const ${name}\\b`, "m"));
  if (start === -1) return undefined;

  const rest = source.slice(start + 1);
  const nextExport = rest.search(EXPORT_PATTERN);
  const end = nextExport === -1 ? source.length : start + 1 + nextExport;

  return source.slice(start, end).trimEnd();
}

type ExampleProps = React.PropsWithChildren<{
  title?: string;
  /** Path to a component within packages, e.g. "buttons/button" */
  of?: string;
  /** Named export in the component's examples file, e.g. "Variants" */
  name?: string;
  /** Add a reset button that remounts the example, for examples that animate on load */
  resettable?: boolean;
}>;

/** Frames a live component example with its source, parallel to a Storybook story. */
export async function Example({
  title,
  of,
  name,
  resettable,
  children,
}: ExampleProps) {
  const code = of && name ? await getExampleSource(of, name) : undefined;
  // Highlighted here so CodePreview never loads Shiki on the client.
  const html = code ? await highlight(code, LANGUAGE) : undefined;

  return (
    <Stack
      data-slot="example"
      id={title ? slugify(title) : undefined}
      data-title={title}
      gap={2}
    >
      {title ? (
        <Text render={<h3 />} size={2} weight="semibold">
          {title}
        </Text>
      ) : null}
      <CodePreview
        code={code}
        html={html}
        language={LANGUAGE}
        resettable={resettable}
        // Examples start at the canvas's start edge, as they did before
        // CodePreview: a centred example wider than the canvas would overflow
        // past the start edge, where its scroll cannot reach.
        CanvasProps={{ ax: "start" }}
      >
        {children}
      </CodePreview>
    </Stack>
  );
}
