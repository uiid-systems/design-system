import type { PreviewConfig, PreviewElement } from "@uiid/registry";

/**
 * Maps component type names to their package imports.
 */
const packageMap: Record<string, string> = {
  Box: "@uiid/layout",
  Stack: "@uiid/layout",
  Group: "@uiid/layout",
  Layer: "@uiid/layout",
  Separator: "@uiid/layout",
  Button: "@uiid/buttons",
  ToggleButton: "@uiid/buttons",
  Form: "@uiid/forms",
  Input: "@uiid/forms",
  Textarea: "@uiid/forms",
  Checkbox: "@uiid/forms",
  Select: "@uiid/forms",
  Switch: "@uiid/forms",
  Text: "@uiid/typography",
  Card: "@uiid/cards",
  Tabs: "@uiid/interactive",
};

/**
 * Serializes a prop value to a JSX-compatible string.
 */
function serializePropValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number") return `{${value}}`;
  if (typeof value === "boolean") return value ? "" : `{false}`;
  if (Array.isArray(value)) return `{${JSON.stringify(value)}}`;
  if (typeof value === "object" && value !== null) {
    return `{${JSON.stringify(value)}}`;
  }
  return `{${String(value)}}`;
}

/**
 * Formats props as JSX attribute strings.
 * Boolean `true` props render as bare attributes (e.g. `fullwidth`).
 * The `children` prop is excluded since it's rendered as JSX children.
 */
function formatProps(props: Record<string, unknown>): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue;
    if (value === true) {
      parts.push(key);
    } else if (value !== undefined && value !== false) {
      parts.push(`${key}=${serializePropValue(value)}`);
    }
  }

  return parts.join(" ");
}

/**
 * Recursively converts a PreviewElement tree into formatted JSX code.
 */
function elementToJsx(
  element: PreviewElement,
  elements: Record<string, PreviewElement>,
  indent: number,
): string {
  const pad = "  ".repeat(indent);
  const { type } = element;
  const { children: childrenProp, ...restProps } = element.props || {};
  const elementChildren = element.children || [];

  const propsStr = formatProps(restProps);
  const opening = propsStr ? `${type} ${propsStr}` : type;

  // Separate slotted vs regular children
  const slottedChildren: { slot: string; jsx: string }[] = [];
  const regularChildren: string[] = [];

  for (const childKey of elementChildren) {
    const child = elements[childKey];
    if (!child) continue;

    if (child.slot) {
      slottedChildren.push({
        slot: child.slot,
        jsx: elementToJsx(child, elements, indent + 2),
      });
    } else {
      regularChildren.push(elementToJsx(child, elements, indent + 1));
    }
  }

  // Text content from props.children
  const textContent = typeof childrenProp === "string" ? childrenProp : null;

  // Build slot props as inline JSX expressions
  let slotProps = "";
  if (slottedChildren.length > 0) {
    const slotParts = slottedChildren.map(({ slot, jsx }) => {
      return `${slot}={\n${jsx}\n${pad}}`;
    });
    slotProps = " " + slotParts.join(" ");
  }

  const fullOpening = slotProps ? `${opening}${slotProps}` : opening;

  // Self-closing if no children
  if (regularChildren.length === 0 && !textContent) {
    return `${pad}<${fullOpening} />`;
  }

  // Inline text content
  if (regularChildren.length === 0 && textContent) {
    const line = `${pad}<${fullOpening}>${textContent}</${type}>`;
    if (line.length <= 80) return line;
    // Wrap long text
    return `${pad}<${fullOpening}>\n${pad}  ${textContent}\n${pad}</${type}>`;
  }

  // Block children
  const childrenJsx = regularChildren.join("\n");
  return `${pad}<${fullOpening}>\n${childrenJsx}\n${pad}</${type}>`;
}

/**
 * Collects all unique component types used in a preview tree.
 */
function collectComponentTypes(
  elementKey: string,
  elements: Record<string, PreviewElement>,
  types: Set<string>,
): void {
  const el = elements[elementKey];
  if (!el) return;
  types.add(el.type);
  for (const childKey of el.children || []) {
    collectComponentTypes(childKey, elements, types);
  }
}

/**
 * Generates import statements grouped by package.
 */
function generateImports(types: Set<string>): string {
  const byPackage = new Map<string, string[]>();

  for (const type of types) {
    const pkg = packageMap[type];
    if (!pkg) continue;
    if (!byPackage.has(pkg)) byPackage.set(pkg, []);
    byPackage.get(pkg)!.push(type);
  }

  // Sort packages and components for stable output
  const lines: string[] = [];
  for (const [pkg, components] of [...byPackage.entries()].sort()) {
    const sorted = components.sort();
    lines.push(`import { ${sorted.join(", ")} } from "${pkg}";`);
  }

  return lines.join("\n");
}

/**
 * Generates a complete code example string from a PreviewConfig.
 * Includes imports and an ExampleComponent wrapper.
 */
export function generateCodeExample(preview: PreviewConfig): string {
  const { tree } = preview;
  const rootElement = tree.elements[tree.root];
  if (!rootElement) return "";

  const types = new Set<string>();
  collectComponentTypes(tree.root, tree.elements, types);

  const imports = generateImports(types);
  const jsx = elementToJsx(rootElement, tree.elements, 1);

  return `${imports}

export function ExampleComponent() {
  return (
${jsx}
  );
}`;
}
