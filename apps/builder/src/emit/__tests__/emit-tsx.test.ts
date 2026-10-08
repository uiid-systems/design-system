import { createDocument, insertNode } from "../../document/document";
import type {
  BuilderDocument,
  BuilderNode,
} from "../../document/document.types";
import { manifest } from "../../manifest/manifest";
import type { PropValue } from "../../manifest/manifest.types";
import expectedTsx from "../__fixtures__/page.tsx?raw";
import expectedTxt from "../__fixtures__/page.txt?raw";
import { emitTsx } from "../emit-tsx";

let counter = 0;
const node = (
  type: string,
  props: Record<string, PropValue> = {},
): BuilderNode => ({
  id: `${type.toLowerCase()}-${++counter}`,
  type,
  props,
  children: [],
});

/** Builds a document from a nested description: [type, props, children?]. */
type Spec = [string, Record<string, PropValue>?, Spec[]?];
const build = (children: Spec[]): BuilderDocument => {
  let doc = createDocument();
  const add = (parentId: string, [type, props = {}, kids = []]: Spec) => {
    const n = node(type, props);
    doc = insertNode(doc, parentId, n);
    for (const kid of kids) add(n.id, kid);
  };
  for (const child of children) add(doc.root, child);
  return doc;
};

/** The lines between `return (` and `);`, with the root's 4-space indent stripped. */
const body = (doc: BuilderDocument) => {
  const lines = emitTsx(doc, manifest).split("\n");
  const start = lines.indexOf("  return (") + 1;
  const end = lines.indexOf("  );");
  return lines.slice(start, end).map((line) => line.slice(4));
};

describe("emitTsx attribute values", () => {
  it("emits strings quoted, numbers braced, true bare, and false braced", () => {
    const doc = build([
      [
        "Button",
        {
          children: "Go",
          variant: "ghost",
          size: "small",
          fullwidth: true,
          disabled: false,
        },
      ],
    ]);

    expect(body(doc)).toEqual([
      "<Stack gap={4} p={6}>",
      '  <Button variant="ghost" size="small" fullwidth disabled={false}>',
      "    Go",
      "  </Button>",
      "</Stack>",
    ]);
  });

  it("omits props that were never set and orders the rest by the manifest", () => {
    const doc = build([["Text", { weight: "bold", children: "Hi", size: 2 }]]);

    expect(body(doc)).toEqual([
      "<Stack gap={4} p={6}>",
      '  <Text size={2} weight="bold">',
      "    Hi",
      "  </Text>",
      "</Stack>",
    ]);
  });

  it("self-closes a node with no children and no text", () => {
    const doc = build([
      ["Input", { label: "Name" }],
      ["Stack", { gap: 2 }],
    ]);

    expect(body(doc)).toEqual([
      "<Stack gap={4} p={6}>",
      '  <Input label="Name" />',
      "  <Stack gap={2} />",
      "</Stack>",
    ]);
  });

  it("self-closes the root when the document is empty", () => {
    expect(body(createDocument())).toEqual(["<Stack gap={4} p={6} />"]);
  });
});

describe("emitTsx text children", () => {
  it("keeps text inline with at most one attribute, and breaks it with two or more", () => {
    const doc = build([
      ["Text", { children: "One" }],
      ["Text", { children: "Two", size: 1 }],
      ["Text", { children: "Three", size: 1, weight: "bold" }],
    ]);

    expect(body(doc)).toEqual([
      "<Stack gap={4} p={6}>",
      "  <Text>One</Text>",
      "  <Text size={1}>Two</Text>",
      '  <Text size={1} weight="bold">',
      "    Three",
      "  </Text>",
      "</Stack>",
    ]);
  });

  it("re-flows text that would pass 80 columns onto filled lines", () => {
    const doc = build([
      [
        "Text",
        {
          children:
            "Built with the UIID page builder and a sentence long enough to pass eighty columns.",
        },
      ],
    ]);

    expect(body(doc)).toEqual([
      "<Stack gap={4} p={6}>",
      "  <Text>",
      "    Built with the UIID page builder and a sentence long enough to pass",
      "    eighty columns.",
      "  </Text>",
      "</Stack>",
    ]);
  });

  it("breaks attributes one per line when the opening tag would pass 80 columns", () => {
    const doc = build([
      [
        "Card",
        {
          title: "A title that is fairly long",
          description: "And a description that pushes the tag past the limit",
        },
      ],
    ]);

    expect(body(doc)).toEqual([
      "<Stack gap={4} p={6}>",
      "  <Card",
      '    title="A title that is fairly long"',
      '    description="And a description that pushes the tag past the limit"',
      "  />",
      "</Stack>",
    ]);
  });
});

describe("emitTsx module", () => {
  it("imports only the components used, sorted, and exports Page", () => {
    const doc = build([
      ["Text", { children: "Hi" }],
      ["Button", { children: "Go" }],
    ]);
    const lines = emitTsx(doc, manifest).split("\n");

    expect(lines[0]).toBe(
      'import { Button, Stack, Text } from "@uiid/design-system";',
    );
    expect(lines[1]).toBe("");
    expect(lines[2]).toBe("export function Page() {");
    expect(lines[3]).toBe("  return (");
    expect(lines.at(-3)).toBe("  );");
    expect(lines.at(-2)).toBe("}");
    expect(lines.at(-1)).toBe("");
  });

  it("emits the success scenario byte-identical to the fixture", () => {
    const doc = build([
      [
        "Card",
        { title: "Welcome" },
        [
          ["Text", { children: "Hello", size: 3, weight: "bold" }],
          ["Text", { children: "Built with the UIID page builder." }],
          [
            "Group",
            { gap: 2 },
            [
              ["Button", { children: "Primary" }],
              ["Button", { children: "Secondary", variant: "ghost" }],
            ],
          ],
        ],
      ],
    ]);

    expect(emitTsx(doc, manifest)).toBe(expectedTxt);
  });

  it("keeps the typechecked .tsx fixture identical to the expected text", () => {
    expect(expectedTsx).toBe(expectedTxt);
  });
});
