import type { UISpec } from "./catalog";
import type { Plugin } from "prettier";
import * as prettier from "prettier/standalone";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { getPackageMap } from "@uiid/registry";

type TreeToJsxOptions = {
  /** Indentation string (default: 2 spaces) */
  indent?: string;
  /** Include import statement at top */
  includeImports?: boolean;
  /** Generate complete React component (default: true) */
  wrapInComponent?: boolean;
  /** Component name (default: derived from root key) */
  componentName?: string;
};

/**
 * Maps component types to their UIID packages.
 * Derived from the registry — no hardcoded duplication.
 */
const COMPONENT_PACKAGES: Record<string, string> = getPackageMap();

/**
 * Form field components that need state management
 */
const FORM_FIELD_TYPES = new Set(["Input", "Textarea", "Checkbox", "Select", "Switch"]);

/**
 * Convert kebab-case to PascalCase for component names
 */
function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// ---------------------------------------------------------------------------
// Expression type guards
// ---------------------------------------------------------------------------

function isBindState(v: unknown): v is { $bindState: string } {
  return typeof v === "object" && v !== null && "$bindState" in v;
}

function isComputed(v: unknown): v is { $computed: Record<string, unknown> } {
  return typeof v === "object" && v !== null && "$computed" in v;
}

function isTemplate(v: unknown): v is { $template: string } {
  return typeof v === "object" && v !== null && "$template" in v;
}

function isStateRef(v: unknown): v is { $state: string } {
  return typeof v === "object" && v !== null && "$state" in v;
}

function isExpression(v: unknown): boolean {
  return isBindState(v) || isComputed(v) || isTemplate(v) || isStateRef(v);
}

// ---------------------------------------------------------------------------
// State path utilities
// ---------------------------------------------------------------------------

/**
 * Convert an absolute state path to a JS variable reference.
 * `/form/email` → `formData.email`
 * `/settings/theme` → `settingsData.theme`
 * `/count` → `rootState.count`
 */
function pathToJsRef(path: string): string {
  const segments = path.replace(/^\//, "").split("/");
  if (segments.length === 1) {
    return `rootState.${segments[0]}`;
  }
  const [group, ...rest] = segments;
  return `${group}Data.${rest.join(".")}`;
}

/** Extract the group name from a state path (first segment, or "root" for single-segment). */
function pathGroup(path: string): string {
  const segments = path.replace(/^\//, "").split("/");
  return segments.length === 1 ? "root" : segments[0];
}

/** Extract the field name from a state path (everything after the group). */
function pathField(path: string): string {
  const segments = path.replace(/^\//, "").split("/");
  return segments.length === 1 ? segments[0] : segments.slice(1).join(".");
}

// ---------------------------------------------------------------------------
// Expression compiler
// ---------------------------------------------------------------------------

const OPERATOR_MAP: Record<string, string> = {
  eq: "===",
  neq: "!==",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  and: "&&",
  or: "||",
};

function compileOperator(op: string, args: unknown): string {
  if (op === "not") {
    return `!(${compileExpression(args)})`;
  }
  if (op === "if") {
    const [cond, thenVal, elseVal] = args as unknown[];
    return `${compileExpression(cond)} ? ${compileExpression(thenVal)} : ${compileExpression(elseVal)}`;
  }
  const jsOp = OPERATOR_MAP[op];
  if (jsOp && Array.isArray(args)) {
    const [left, right] = args;
    return `${compileExpression(left)} ${jsOp} ${compileExpression(right)}`;
  }
  // Fallback — unknown operator, emit as-is
  return JSON.stringify({ [op]: args });
}

function compileExpression(value: unknown): string {
  if (isStateRef(value)) {
    return pathToJsRef(value.$state);
  }
  if (isBindState(value)) {
    return pathToJsRef(value.$bindState);
  }
  if (isTemplate(value)) {
    // Convert {{/form/name}} → ${formData.name}
    const body = value.$template.replace(/\{\{([^}]+)\}\}/g, (_match, p: string) => {
      return `\${${pathToJsRef(p)}}`;
    });
    return `\`${body}\``;
  }
  if (isComputed(value)) {
    const expr = value.$computed;
    const [op] = Object.keys(expr);
    return compileOperator(op, expr[op]);
  }
  if (typeof value === "string") {
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

// ---------------------------------------------------------------------------
// Binding collection
// ---------------------------------------------------------------------------

type StateBinding = {
  path: string;
  group: string;
  field: string;
  type: "string" | "boolean";
  twoWay: boolean;
};

function collectBindings(
  tree: { root: string; elements: Record<string, { type: string; props?: Record<string, unknown>; children?: string[] }> },
): Map<string, StateBinding> {
  const bindings = new Map<string, StateBinding>();

  function addPath(path: string, twoWay: boolean, inferredType: "string" | "boolean") {
    const existing = bindings.get(path);
    if (existing) {
      if (twoWay) existing.twoWay = true;
      return;
    }
    bindings.set(path, {
      path,
      group: pathGroup(path),
      field: pathField(path),
      type: inferredType,
      twoWay,
    });
  }

  function extractPaths(value: unknown) {
    if (isStateRef(value)) {
      addPath(value.$state, false, "string");
    } else if (isBindState(value)) {
      // twoWay set below with prop context
    } else if (isTemplate(value)) {
      const matches = value.$template.matchAll(/\{\{([^}]+)\}\}/g);
      for (const m of matches) {
        addPath(m[1], false, "string");
      }
    } else if (isComputed(value)) {
      extractPathsFromComputed(value.$computed);
    }
  }

  function extractPathsFromComputed(expr: Record<string, unknown>) {
    for (const args of Object.values(expr)) {
      if (Array.isArray(args)) {
        for (const arg of args) extractPaths(arg);
      } else {
        extractPaths(args);
      }
    }
  }

  function walk(elementKey: string) {
    const element = tree.elements[elementKey];
    if (!element) return;

    const props = element.props || {};
    for (const [propKey, value] of Object.entries(props)) {
      if (isBindState(value)) {
        const isBool = propKey === "checked" || propKey === "pressed";
        addPath(value.$bindState, true, isBool ? "boolean" : "string");
      } else if (isExpression(value)) {
        extractPaths(value);
      }
    }

    if (element.children) {
      for (const childKey of element.children) walk(childKey);
    }
  }

  walk(tree.root);
  return bindings;
}

/**
 * Converts a UISpec to formatted JSX code string.
 */
export function treeToJsx(
  tree: UISpec,
  options: TreeToJsxOptions = {}
): string {
  const { indent = "  ", includeImports = true, wrapInComponent = true, componentName } = options;

  const usedComponents = new Set<string>();
  const usedIcons = new Set<string>();
  const usedSimpleIcons = new Set<string>();
  const formFields: Array<{ name: string; type: string; elementType: string }> = [];

  // Collect expression bindings upfront (referenced by serializeProps)
  let expressionBindings: Map<string, StateBinding> = new Map();

  // Collect all form fields for state generation
  function collectFormFields(elementKey: string) {
    const element = tree.elements[elementKey];
    if (!element) return;

    if (FORM_FIELD_TYPES.has(element.type) && element.props?.name) {
      formFields.push({
        name: element.props.name as string,
        type: element.type === "Checkbox" || element.type === "Switch" ? "boolean" : "string",
        elementType: element.type,
      });
    }

    // Recurse into children
    if (element.children) {
      for (const childKey of element.children) {
        collectFormFields(childKey);
      }
    }
  }

  function serializeValue(value: unknown): string {
    if (isExpression(value)) {
      return compileExpression(value);
    }
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

  function serializeProps(
    props: Record<string, unknown>,
    elementType: string,
    isIcon: boolean,
    isSimpleIcon: boolean,
    elementKey?: string,
  ): string[] {
    const result: string[] = [];
    const fieldName = props.name as string | undefined;
    const hasExprBindings = expressionBindings.size > 0;
    const isFormField = !hasExprBindings && FORM_FIELD_TYPES.has(elementType) && fieldName && formFields.length > 0;
    const isCheckboxOrSwitch = elementType === "Checkbox" || elementType === "Switch";

    // Track which props are $bindState so we generate value + onChange together
    const bindStateProps: Array<{ propKey: string; path: string }> = [];

    for (const [key, value] of Object.entries(props)) {
      // Skip children prop - handled separately
      if (key === "children") continue;
      // Skip action prop - internal to json-render
      if (key === "action") continue;
      // Skip name prop for Icon/SimpleIcon - it becomes the component type
      if (key === "name" && (isIcon || isSimpleIcon)) continue;

      // $bindState props — defer to generate value + handler pair
      if (isBindState(value)) {
        bindStateProps.push({ propKey: key, path: value.$bindState });
        continue;
      }

      if (isExpression(value)) {
        result.push(`${key}={${compileExpression(value)}}`);
      } else if (typeof value === "boolean" && value === true) {
        // Boolean shorthand: <Input required /> instead of <Input required={true} />
        result.push(key);
      } else if (typeof value === "string") {
        result.push(`${key}=${serializeValue(value)}`);
      } else {
        result.push(`${key}={${serializeValue(value)}}`);
      }
    }

    // Generate value + onChange pairs for $bindState props
    for (const { propKey, path } of bindStateProps) {
      const ref = pathToJsRef(path);
      const group = pathGroup(path);
      const field = pathField(path);
      const setterName = `set${group.charAt(0).toUpperCase() + group.slice(1)}${group === "root" ? "State" : "Data"}`;

      result.push(`${propKey}={${ref}}`);

      // Generate the appropriate change handler
      if (propKey === "checked") {
        result.push(`onCheckedChange={(checked) => ${setterName}((prev) => ({ ...prev, ${field}: checked }))}`);
      } else if (propKey === "pressed") {
        result.push(`onPressedChange={(pressed) => ${setterName}((prev) => ({ ...prev, ${field}: pressed }))}`);
      } else {
        result.push(`onChange={(e) => ${setterName}((prev) => ({ ...prev, ${field}: e.target.value }))}`);
      }
    }

    // Legacy: add value/onChange handlers for form fields when wrapping in component
    if (isFormField && wrapInComponent) {
      if (isCheckboxOrSwitch) {
        result.push(`checked={formData.${fieldName}}`);
        result.push(`onCheckedChange={(checked) => handleChange("${fieldName}", checked)}`);
      } else {
        result.push(`value={formData.${fieldName}}`);
        result.push(`onChange={(e) => handleChange("${fieldName}", e.target.value)}`);
      }
    }

    return result;
  }

  function renderElement(elementKey: string, depth: number): string {
    const element = tree.elements[elementKey];
    if (!element) return "";

    // Handle Icon/SimpleIcon type specially - use the name prop as the component type
    const isIcon = element.type === "Icon";
    const isSimpleIcon = element.type === "SimpleIcon";
    const iconName = (isIcon || isSimpleIcon) ? (element.props?.name as string) : null;
    const componentType = (isIcon || isSimpleIcon) && iconName ? iconName : element.type;

    if (isIcon && iconName) {
      usedIcons.add(iconName);
    } else if (isSimpleIcon && iconName) {
      usedSimpleIcons.add(iconName);
    } else {
      usedComponents.add(element.type);
    }

    const currentIndent = indent.repeat(depth);
    const childIndent = indent.repeat(depth + 1);
    const props = serializeProps(element.props || {}, element.type, isIcon, isSimpleIcon, elementKey);

    // Get text children from props.children (if string or expression)
    const rawChildren = element.props?.children;
    const textChildren =
      typeof rawChildren === "string"
        ? rawChildren
        : isExpression(rawChildren)
          ? `{${compileExpression(rawChildren)}}`
          : null;

    // Get element children
    const childElements = element.children || [];
    const hasChildren = childElements.length > 0 || textChildren;

    // Build opening tag
    let jsx = `${currentIndent}<${componentType}`;

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

      jsx += `</${componentType}>`;
    }

    return jsx;
  }

  // Collect expression bindings (new path) — if none found, fall back to legacy formFields
  expressionBindings = collectBindings(tree);

  // Collect legacy form fields (only used when no expressions found)
  if (expressionBindings.size === 0) {
    collectFormFields(tree.root);
  }

  // Render the tree starting from root
  const jsxCode = renderElement(tree.root, wrapInComponent ? 2 : 0);

  if (!includeImports) {
    return jsxCode;
  }

  // Group components by package
  const componentsByPackage = new Map<string, string[]>();
  for (const component of Array.from(usedComponents).sort()) {
    const pkg = COMPONENT_PACKAGES[component] || "@uiid/ui";
    if (!componentsByPackage.has(pkg)) {
      componentsByPackage.set(pkg, []);
    }
    componentsByPackage.get(pkg)!.push(component);
  }

  // Build import statements
  let imports = `"use client";\n\n`;

  const hasFormFields = formFields.length > 0;
  const hasExprBindings = expressionBindings.size > 0;
  const needsState = hasFormFields || hasExprBindings;
  if (needsState) {
    imports += `import { useState } from "react";\n`;
  }
  imports += `\n`;

  // Add UIID package imports
  for (const [pkg, components] of componentsByPackage) {
    imports += `import { ${components.join(", ")} } from "${pkg}";\n`;
  }

  // Add icon imports (direct imports for tree-shaking)
  if (usedIcons.size > 0) {
    const sortedIcons = Array.from(usedIcons).sort();
    imports += `import { ${sortedIcons.join(", ")} } from "@uiid/icons";\n`;
  }

  // Add simple icon imports (brand icons)
  if (usedSimpleIcons.size > 0) {
    const sortedSimpleIcons = Array.from(usedSimpleIcons).sort();
    imports += `import { ${sortedSimpleIcons.join(", ")} } from "@icons-pack/react-simple-icons";\n`;
  }

  if (!wrapInComponent) {
    return imports + "\n" + jsxCode;
  }

  // Generate component name from root key
  const derivedName = componentName || toPascalCase(tree.root);

  // Build the complete component
  let component = imports + "\n";

  if (hasExprBindings) {
    // --- Expression-aware state generation ---

    // Group bindings by state group
    const groups = new Map<string, StateBinding[]>();
    for (const binding of expressionBindings.values()) {
      const list = groups.get(binding.group) || [];
      list.push(binding);
      groups.set(binding.group, list);
    }

    const hasTwoWayBindings = [...expressionBindings.values()].some((b) => b.twoWay);

    // Emit interfaces
    for (const [group, bindings] of groups) {
      const interfaceName = group === "root"
        ? "RootState"
        : `${group.charAt(0).toUpperCase() + group.slice(1)}Data`;

      component += `interface ${interfaceName} {\n`;
      for (const b of bindings) {
        component += `  ${b.field}: ${b.type};\n`;
      }
      component += `}\n\n`;
    }

    // Open component function
    component += `export function ${derivedName}() {\n`;

    // Emit one useState per group
    for (const [group, bindings] of groups) {
      const interfaceName = group === "root"
        ? "RootState"
        : `${group.charAt(0).toUpperCase() + group.slice(1)}Data`;
      const varName = group === "root" ? "rootState" : `${group}Data`;
      const setterName = group === "root"
        ? "setRootState"
        : `set${group.charAt(0).toUpperCase() + group.slice(1)}Data`;

      component += `  const [${varName}, ${setterName}] = useState<${interfaceName}>({\n`;
      for (const b of bindings) {
        const defaultValue = b.type === "boolean" ? "false" : '""';
        component += `    ${b.field}: ${defaultValue},\n`;
      }
      component += `  });\n\n`;
    }

    if (hasTwoWayBindings) {
      component += `  const handleSubmit = (e: React.FormEvent) => {\n`;
      component += `    e.preventDefault();\n`;
      component += `    // Add your submission logic here\n`;
      component += `  };\n\n`;

      component += `  return (\n`;
      component += `    <form onSubmit={handleSubmit} noValidate>\n`;
      component += jsxCode + "\n";
      component += `    </form>\n`;
      component += `  );\n`;
    } else {
      component += `  return (\n`;
      component += jsxCode + "\n";
      component += `  );\n`;
    }
    component += `}\n`;
  } else if (hasFormFields) {
    // --- Legacy form field state generation (unchanged) ---
    component += `interface FormData {\n`;
    for (const field of formFields) {
      component += `  ${field.name}: ${field.type};\n`;
    }
    component += `}\n\n`;

    component += `export function ${derivedName}() {\n`;
    component += `  const [formData, setFormData] = useState<FormData>({\n`;
    for (const field of formFields) {
      const defaultValue = field.type === "boolean" ? "false" : '""';
      component += `    ${field.name}: ${defaultValue},\n`;
    }
    component += `  });\n\n`;

    component += `  const handleSubmit = (e: React.FormEvent) => {\n`;
    component += `    e.preventDefault();\n`;
    component += `    // Add your validation and submission logic here\n`;
    component += `    console.log(formData);\n`;
    component += `  };\n\n`;

    component += `  const handleChange = (name: keyof FormData, value: FormData[keyof FormData]) => {\n`;
    component += `    setFormData((prev) => ({ ...prev, [name]: value }));\n`;
    component += `  };\n\n`;

    component += `  return (\n`;
    component += `    <form onSubmit={handleSubmit} noValidate>\n`;
    component += jsxCode + "\n";
    component += `    </form>\n`;
    component += `  );\n`;
    component += `}\n`;
  } else {
    // Simple component without state
    component += `export function ${derivedName}() {\n`;
    component += `  return (\n`;
    component += jsxCode + "\n";
    component += `  );\n`;
    component += `}\n`;
  }

  return component;
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
  tree: UISpec,
  options: TreeToJsxOptions = {}
): Promise<string> {
  const jsx = treeToJsx(tree, options);
  return formatJsx(jsx);
}
