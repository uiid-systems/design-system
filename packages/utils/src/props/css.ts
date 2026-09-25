import { styleProps } from "./styles";

const kebab = (property: string) =>
  property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/**
 * The CSS that resolves style props. `prepareComponentProps` puts each value
 * on the element as `data-ui-{key}` and a raw `--props-{key}`; these rules turn
 * the raw value into a declaration.
 *
 * Written to `@uiid/tokens/src/props.css` by `pnpm generate:props`. CI runs it
 * with `--check`, which fails when the two drift apart.
 */
export function stylePropsCss() {
  const rules: string[] = [];

  for (const [key, styleProp] of Object.entries(styleProps)) {
    const property = kebab(styleProp.property);
    const raw = `var(--props-${key})`;

    const value =
      "unit" in styleProp
        ? `calc(${raw} * var(${styleProp.unit.variable}))`
        : "values" in styleProp
          ? raw
          : `calc(${raw} * 1px)`;

    rules.push(`  [data-ui-${key}] {\n    ${property}: ${value};\n  }`);

    if ("keywords" in styleProp) {
      for (const keyword of styleProp.keywords) {
        rules.push(
          `  [data-ui-${key}="${keyword}"] {\n    ${property}: ${keyword};\n  }`,
        );
      }
    }
  }

  return `${HEADER}@layer uiid.props {\n${rules.join("\n\n")}\n}\n`;
}

const HEADER = `/**
 * Generated from \`@uiid/utils\` style props — do not edit by hand.
 * Regenerate with \`pnpm generate:props\`.
 *
 * \`uiid.props\` sits after \`uiid.components\`, so a style prop beats a
 * component's own styles, and before \`uiid.states\`. Unlayered consumer CSS
 * beats every layer, so a consumer can override a style prop from a class.
 */
`;
