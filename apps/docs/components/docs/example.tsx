import fs from "node:fs/promises";
import path from "node:path";

import { CodeBlock, Stack, Text } from "@uiid/design-system";

import { slugify } from "./slugify";

const PACKAGES_DIR = path.resolve(process.cwd(), "../../packages");

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
}>;

/** Frames a live component example with its source, parallel to a Storybook story. */
export async function Example({ title, of, name, children }: ExampleProps) {
  const code = of && name ? await getExampleSource(of, name) : undefined;

  return (
    <Stack
      data-slot="example"
      id={title ? slugify(title) : undefined}
      data-title={title}
      className="scroll-mt-20"
      gap={2}
      ax="stretch"
    >
      {title && !code ? (
        <Text render={<h3 />} size={2} weight="semibold">
          {title}
        </Text>
      ) : null}
      <Stack data-slot="example-canvas" b={1} p={6} ax="start">
        {children}
      </Stack>
      {code ? (
        <CodeBlock code={code} language="tsx" filename={title} rows={8} />
      ) : null}
    </Stack>
  );
}
