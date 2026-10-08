import type {
  BuilderDocument,
  BuilderNode,
  NodeId,
} from "../document/document.types";
import type { ComponentDoc, PropValue } from "../manifest/manifest.types";

/** Formatter settings the output has to agree with, so `oxfmt` leaves it alone. */
const PRINT_WIDTH = 80;
const INDENT = "  ";
const PACKAGE = "@uiid/design-system";

/** The root sits inside `return (`, two levels in. */
const ROOT_DEPTH = 2;

/**
 * Turns a document into a TSX module, laid out the way the repo formatter lays
 * out JSX: a text child stays inline only when the element has at most one
 * attribute and the line fits; attributes break one per line when the opening
 * tag would not fit; long text re-flows word by word at the print width.
 */
export function emitTsx(
  doc: BuilderDocument,
  manifest: Record<string, ComponentDoc>,
): string {
  const used = new Set<string>();
  const body = emitNode(doc, doc.root, manifest, ROOT_DEPTH, used);
  const names = [...used].sort();

  return [
    `import { ${names.join(", ")} } from "${PACKAGE}";`,
    "",
    "export function Page() {",
    "  return (",
    ...body,
    "  );",
    "}",
    "",
  ].join("\n");
}

function emitNode(
  doc: BuilderDocument,
  id: NodeId,
  manifest: Record<string, ComponentDoc>,
  depth: number,
  used: Set<string>,
): string[] {
  const node = doc.nodes[id];
  used.add(node.type);

  const pad = INDENT.repeat(depth);
  const inner = pad + INDENT;
  const attrs = attributesOf(node, manifest[node.type]);
  const text =
    typeof node.props.children === "string" ? node.props.children : "";
  const kids = node.children;

  if (kids.length === 0 && text === "") {
    return openingTag(node.type, attrs, pad, true);
  }

  if (kids.length === 0 && attrs.length <= 1) {
    const line = `${pad}<${node.type}${attrs.map((a) => ` ${a}`).join("")}>${jsxText(text)}</${node.type}>`;
    if (line.length <= PRINT_WIDTH) return [line];
  }

  const children =
    kids.length > 0
      ? kids.flatMap((childId) =>
          emitNode(doc, childId, manifest, depth + 1, used),
        )
      : textLines(text, inner);

  return [
    ...openingTag(node.type, attrs, pad, false),
    ...children,
    `${pad}</${node.type}>`,
  ];
}

/** `<Type a b>` on one line when it fits, otherwise one attribute per line. */
function openingTag(
  type: string,
  attrs: string[],
  pad: string,
  selfClosing: boolean,
): string[] {
  const close = selfClosing ? " />" : ">";
  const line = `${pad}<${type}${attrs.map((a) => ` ${a}`).join("")}${close}`;
  if (line.length <= PRINT_WIDTH) return [line];

  return [
    `${pad}<${type}`,
    ...attrs.map((a) => `${pad}${INDENT}${a}`),
    `${pad}${selfClosing ? "/>" : ">"}`,
  ];
}

/** Set props in manifest order, `children` excluded, unknown names last. */
function attributesOf(
  node: BuilderNode,
  doc: ComponentDoc | undefined,
): string[] {
  const known = Object.keys(doc?.props ?? {});
  const names = [
    ...known.filter((name) => name in node.props),
    ...Object.keys(node.props).filter((name) => !known.includes(name)),
  ];

  return names
    .filter((name) => name !== "children" && node.props[name] !== undefined)
    .map((name) => attribute(name, node.props[name]));
}

function attribute(name: string, value: PropValue): string {
  if (value === true) return name;
  if (typeof value === "string") {
    // A quote or newline cannot live in a JSX string attribute; brace it.
    return /["\n]/.test(value)
      ? `${name}={${JSON.stringify(value)}}`
      : `${name}="${value}"`;
  }
  return `${name}={${String(value)}}`;
}

/** JSX text is literal unless it holds characters JSX would parse. */
function jsxText(text: string): string {
  return /[{}<>]/.test(text) ? `{${JSON.stringify(text)}}` : text;
}

/** Text on its own lines, re-flowed word by word to the print width. */
function textLines(text: string, pad: string): string[] {
  const literal = jsxText(text);
  if (literal !== text) return [pad + literal];

  const width = PRINT_WIDTH - pad.length;
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (current && `${current} ${word}`.length > width) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines.map((line) => pad + line);
}
