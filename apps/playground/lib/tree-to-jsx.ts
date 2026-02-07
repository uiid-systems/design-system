import type { UITree } from "@json-render/core";
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

/**
 * Converts a UITree to formatted JSX code string.
 */
export function treeToJsx(
  tree: UITree,
  options: TreeToJsxOptions = {}
): string {
  const { indent = "  ", includeImports = true, wrapInComponent = true, componentName } = options;

  const usedComponents = new Set<string>();
  const usedIcons = new Set<string>();
  const formFields: Array<{ name: string; type: string; elementType: string }> = [];

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

  function serializeProps(props: Record<string, unknown>, elementType: string, isIcon: boolean): string[] {
    const result: string[] = [];
    const fieldName = props.name as string | undefined;
    const isFormField = FORM_FIELD_TYPES.has(elementType) && fieldName && formFields.length > 0;
    const isCheckboxOrSwitch = elementType === "Checkbox" || elementType === "Switch";

    for (const [key, value] of Object.entries(props)) {
      // Skip children prop - handled separately
      if (key === "children") continue;
      // Skip action prop - internal to json-render
      if (key === "action") continue;
      // Skip name prop for Icon - it becomes the component type
      if (key === "name" && isIcon) continue;

      if (typeof value === "boolean" && value === true) {
        // Boolean shorthand: <Input required /> instead of <Input required={true} />
        result.push(key);
      } else if (typeof value === "string") {
        result.push(`${key}=${serializeValue(value)}`);
      } else {
        result.push(`${key}={${serializeValue(value)}}`);
      }
    }

    // Add value/onChange handlers for form fields when wrapping in component
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

    // Handle Icon type specially - use the name prop as the component type
    const isIcon = element.type === "Icon";
    const iconName = isIcon ? (element.props?.name as string) : null;
    const componentType = isIcon && iconName ? iconName : element.type;

    if (isIcon && iconName) {
      usedIcons.add(iconName);
    } else {
      usedComponents.add(element.type);
    }

    const currentIndent = indent.repeat(depth);
    const childIndent = indent.repeat(depth + 1);
    const props = serializeProps(element.props || {}, element.type, isIcon);

    // Get text children from props.children (if string)
    const textChildren =
      typeof element.props?.children === "string"
        ? element.props.children
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

  // Collect form fields for state generation
  collectFormFields(tree.root);

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
  if (hasFormFields) {
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

  if (!wrapInComponent) {
    return imports + "\n" + jsxCode;
  }

  // Generate component name from root key
  const derivedName = componentName || toPascalCase(tree.root);

  // Build the complete component
  let component = imports + "\n";

  if (hasFormFields) {
    // Generate form state interface
    component += `interface FormData {\n`;
    for (const field of formFields) {
      component += `  ${field.name}: ${field.type};\n`;
    }
    component += `}\n\n`;

    // Generate component with form handling
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
    // Simple component without form state
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
  tree: UITree,
  options: TreeToJsxOptions = {}
): Promise<string> {
  const jsx = treeToJsx(tree, options);
  return formatJsx(jsx);
}
