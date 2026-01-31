import { categories } from "../categories";
import { registry } from "../manifest";
import type { ComponentEntry, PropDocumentation } from "../types";
import { extractPropsFromSchema } from "./schema-to-docs";

/**
 * Props that should be excluded from the LLM reference.
 * Internal implementation details (forwarded sub-component props).
 */
const EXCLUDED_PROPS = new Set([
  "RootProps",
  "TriggerProps",
  "PortalProps",
  "BackdropProps",
  "PopupProps",
  "PositionerProps",
  "ProviderProps",
  "ContentProps",
]);

/**
 * Inherited spacing/border props that are available on layout-based components
 * but should be collapsed into a single note rather than listed individually.
 * These come from SpacingPropsSchema, BorderPropsSchema, and LayoutPropsSchema.
 */
const SHARED_LAYOUT_PROPS = new Set([
  "gap",
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "b",
  "bx",
  "by",
  "bl",
  "br",
  "bt",
  "bb",
  "ax",
  "ay",
  "direction",
  "evenly",
  "fullwidth",
  "fullheight",
  "fullscreen",
]);

/**
 * Key layout props to highlight for layout components (not exhaustive list).
 */
const KEY_LAYOUT_PROPS = [
  "gap",
  "p",
  "ax",
  "ay",
  "fullwidth",
  "fullheight",
  "evenly",
];

/**
 * Format a prop type for LLM consumption.
 */
function formatPropType(prop: PropDocumentation): string {
  if (prop.type === "any") return "string";
  if (prop.type === "(...args: any[]) => any") return "function";
  return prop.type;
}

/**
 * Format a default value for display.
 */
function formatDefault(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return `\`"${value}"\``;
  return `\`${String(value)}\``;
}

/**
 * Generate a markdown prop table row.
 */
function formatPropRow(prop: PropDocumentation): string {
  const type = formatPropType(prop);
  const desc = prop.description || "";
  const def = formatDefault(prop.defaultValue);
  const defStr = def ? ` (default: ${def})` : "";
  return `| \`${prop.name}\` | ${type} | ${desc}${defStr} |`;
}

/**
 * Check if a component inherits layout props (extends Box/Spacing schemas).
 */
function hasLayoutProps(entry: ComponentEntry): boolean {
  const props = extractPropsFromSchema(entry.propsSchema, entry.defaults);
  const propNames = new Set(props.map((p) => p.name));
  // If it has gap + ax + ay, it's a layout-based component
  return propNames.has("gap") && propNames.has("ax") && propNames.has("ay");
}

/**
 * Check if a component inherits spacing props (but not full layout).
 */
function hasSpacingProps(entry: ComponentEntry): boolean {
  const props = extractPropsFromSchema(entry.propsSchema, entry.defaults);
  const propNames = new Set(props.map((p) => p.name));
  return propNames.has("p") && propNames.has("m") && !propNames.has("ax");
}

/**
 * Generate a markdown prop table for a single component.
 * Collapses inherited layout/spacing props into a summary note.
 */
function generatePropTable(entry: ComponentEntry): string {
  const allProps = extractPropsFromSchema(entry.propsSchema, entry.defaults);
  const isLayout = hasLayoutProps(entry);
  const isSpacing = !isLayout && hasSpacingProps(entry);

  // Split into component-specific and inherited props
  const specificProps = allProps.filter(
    (p) => !EXCLUDED_PROPS.has(p.name) && !SHARED_LAYOUT_PROPS.has(p.name)
  );

  const inheritedProps = allProps.filter(
    (p) => !EXCLUDED_PROPS.has(p.name) && SHARED_LAYOUT_PROPS.has(p.name)
  );

  // For non-layout components with no inherited props, just show everything
  if (!isLayout && !isSpacing) {
    const filtered = allProps.filter((p) => !EXCLUDED_PROPS.has(p.name));
    if (filtered.length === 0) return "";
    return [
      "| Prop | Type | Description |",
      "| --- | --- | --- |",
      ...filtered.map(formatPropRow),
    ].join("\n");
  }

  const lines: string[] = [];

  // Show component-specific props first
  if (specificProps.length > 0) {
    lines.push("| Prop | Type | Description |");
    lines.push("| --- | --- | --- |");
    lines.push(...specificProps.map(formatPropRow));
    lines.push("");
  }

  // Summarize inherited props
  if (isLayout && inheritedProps.length > 0) {
    const keyProps = KEY_LAYOUT_PROPS.filter((k) =>
      inheritedProps.some((p) => p.name === k)
    );
    lines.push(
      `Also supports layout props: \`${keyProps.join("`, `")}\`, plus all spacing (\`px\`, \`py\`, \`pt\`...), margin (\`mx\`, \`my\`, \`mt\`...), and border (\`b\`, \`bx\`, \`by\`...) props.`
    );
  } else if (isSpacing && inheritedProps.length > 0) {
    lines.push(
      "Also supports spacing props: `p`, `px`, `py`, `m`, `mx`, `my`, etc."
    );
  }

  return lines.join("\n");
}

/**
 * Generate a markdown section for a single component.
 */
function generateComponentSection(
  name: string,
  entry: ComponentEntry
): string {
  const lines: string[] = [];

  lines.push(`#### ${name}`);
  lines.push("");

  if (entry.description) {
    lines.push(entry.description);
    lines.push("");
  }

  if (entry.usage) {
    lines.push(entry.usage);
    lines.push("");
  }

  if (entry.hasChildren) {
    lines.push("Supports children.");
    lines.push("");
  }

  if (entry.slots && Object.keys(entry.slots).length > 0) {
    lines.push("**Slots (use as props):**");
    for (const [slotName, slotDesc] of Object.entries(entry.slots)) {
      lines.push(`- \`${slotName}\`: ${slotDesc}`);
    }
    lines.push("");
  }

  const table = generatePropTable(entry);
  if (table) {
    lines.push(table);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate the precomposed components table.
 * Shows which components use props vs children for content.
 */
function generatePrecomposedTable(): string {
  const rows: string[] = [];

  for (const [name, entry] of Object.entries(registry)) {
    const props = extractPropsFromSchema(entry.propsSchema, entry.defaults);
    const propNames = props.map((p) => p.name);

    // Identify "content" props (label, title, description, placeholder, items)
    const contentProps = propNames.filter((p) =>
      [
        "label",
        "title",
        "description",
        "placeholder",
        "items",
        "icon",
        "footer",
        "action",
      ].includes(p)
    );

    if (contentProps.length === 0 && !entry.hasChildren) continue;

    const propsStr =
      contentProps.length > 0
        ? contentProps.map((p) => `\`${p}\``).join(", ")
        : "N/A";
    const childrenStr = entry.hasChildren
      ? propNames.includes("title") || propNames.includes("label")
        ? "Custom body content"
        : "Content"
      : "N/A (no children)";

    rows.push(`| ${name} | ${propsStr} | ${childrenStr} |`);
  }

  return [
    "| Component | Use props for... | Use children for... |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
}

/**
 * Generate a complete LLM-oriented component reference from the registry.
 *
 * Returns a markdown string documenting all available components,
 * organized by category, with prop tables generated from Zod schemas.
 * Inherited layout/spacing props are collapsed into summary notes
 * to keep the reference concise for LLM consumption.
 */
export function generateComponentReference(): string {
  const sections: string[] = [];

  sections.push("## Available Components");
  sections.push("");

  // Precomposed components table
  sections.push("### Precomposed Components");
  sections.push("");
  sections.push(
    "UIID components are **precomposed** — they handle their own internal structure. Use props for metadata, children for custom content only."
  );
  sections.push("");
  sections.push(generatePrecomposedTable());
  sections.push("");

  // Group by category
  for (const { key, label } of categories) {
    const components = Object.entries(registry).filter(
      ([, entry]) => entry.category === key
    );

    if (components.length === 0) continue;

    sections.push(`### ${label}`);
    sections.push("");

    for (const [name, entry] of components) {
      sections.push(generateComponentSection(name, entry));
    }

    sections.push("---");
    sections.push("");
  }

  // Component type list for validation
  const allNames = Object.keys(registry).join(", ");
  sections.push("### All Component Types");
  sections.push("");
  sections.push(`Valid types: ${allNames}`);
  sections.push("");

  return sections.join("\n");
}
