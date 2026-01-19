import type { UITree } from "@json-render/core";
import type { Plugin } from "prettier";
import * as prettier from "prettier/standalone";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";

type TreeToJsxOptions = {
  /** Indentation string (default: 2 spaces) */
  indent?: string;
  /** Include import statement at top */
  includeImports?: boolean;
};

/**
 * Converts a UITree to formatted JSX code string.
 */
export function treeToJsx(
  tree: UITree,
  options: TreeToJsxOptions = {}
): string {
  const { indent = "  ", includeImports = true } = options;

  const usedComponents = new Set<string>();

  function serializeValue(value: unknown): string {
    if (typeof value === "string") {
      // Use double quotes for strings, escape internal quotes
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (value === null || value === undefined) {
      return String(value);
    }
    if (Array.isArray(value) || typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  }

  function serializeProps(props: Record<string, unknown>): string[] {
    const result: string[] = [];

    for (const [key, value] of Object.entries(props)) {
      // Skip children prop - handled separately
      if (key === "children") continue;
      // Skip action prop - internal to json-render
      if (key === "action") continue;

      if (typeof value === "boolean" && value === true) {
        // Boolean shorthand: <Input required /> instead of <Input required={true} />
        result.push(key);
      } else if (typeof value === "string") {
        result.push(`${key}=${serializeValue(value)}`);
      } else {
        result.push(`${key}={${serializeValue(value)}}`);
      }
    }

    return result;
  }

  function renderElement(elementKey: string, depth: number): string {
    const element = tree.elements[elementKey];
    if (!element) return "";

    usedComponents.add(element.type);

    const currentIndent = indent.repeat(depth);
    const childIndent = indent.repeat(depth + 1);
    const props = serializeProps(element.props || {});

    // Get text children from props.children (if string)
    const textChildren =
      typeof element.props?.children === "string"
        ? element.props.children
        : null;

    // Get element children
    const childElements = element.children || [];
    const hasChildren = childElements.length > 0 || textChildren;

    // Build opening tag
    let jsx = `${currentIndent}<${element.type}`;

    if (props.length > 0) {
      if (props.length <= 2 && props.every((p) => p.length < 20)) {
        // Short props on same line
        jsx += ` ${props.join(" ")}`;
      } else {
        // Multiple props on separate lines
        jsx += `\n${props.map((p) => `${childIndent}${p}`).join("\n")}\n${currentIndent}`;
      }
    }

    if (!hasChildren) {
      // Self-closing tag
      jsx += " />";
    } else {
      jsx += ">";

      if (textChildren && childElements.length === 0) {
        // Text-only children on same line
        jsx += textChildren;
      } else {
        jsx += "\n";

        // Render text children first if mixed
        if (textChildren) {
          jsx += `${childIndent}${textChildren}\n`;
        }

        // Render child elements
        for (const childKey of childElements) {
          jsx += renderElement(childKey, depth + 1) + "\n";
        }

        jsx += currentIndent;
      }

      jsx += `</${element.type}>`;
    }

    return jsx;
  }

  // Render the tree starting from root
  const jsxCode = renderElement(tree.root, 0);

  if (!includeImports) {
    return jsxCode;
  }

  // Generate import statement
  const components = Array.from(usedComponents).sort();
  const importStatement = `import { ${components.join(", ")} } from "@uiid/ui";\n\n`;

  return importStatement + jsxCode;
}

/**
 * Format JSX code with Prettier (async, for use in browser)
 */
export async function formatJsx(code: string): Promise<string> {
  try {
    return await prettier.format(code, {
      parser: "babel",
      plugins: [prettierPluginBabel, prettierPluginEstree as Plugin],
      printWidth: 80,
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      jsxSingleQuote: false,
      trailingComma: "es5",
    });
  } catch {
    // If formatting fails, return original code
    return code;
  }
}

/**
 * Convert tree to JSX and format with Prettier
 */
export async function treeToFormattedJsx(
  tree: UITree,
  options: TreeToJsxOptions = {}
): Promise<string> {
  const jsx = treeToJsx(tree, options);
  return formatJsx(jsx);
}
