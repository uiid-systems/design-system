import { styleProps } from "./styles";
import { toggleProps } from "./styles/toggles";
import { BREAKPOINTS } from "./types";

type AnyStyleProp = (typeof styleProps)[keyof typeof styleProps];

const kebab = (property: string) =>
  property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const rule = (selector: string, declaration: string, indent: string) =>
  `${indent}${selector} {\n${indent}  ${declaration};\n${indent}}`;

/** The rules for one style prop, read from `data-ui-{key}{suffix}`. */
function rulesFor(
  key: string,
  styleProp: AnyStyleProp,
  suffix = "",
  indent = "  ",
) {
  const property = kebab(styleProp.property);
  const raw = `var(--props-${key}${suffix})`;

  const value =
    "unit" in styleProp
      ? `calc(${raw} * var(${styleProp.unit.variable}))`
      : "values" in styleProp
        ? raw
        : `calc(${raw} * 1px)`;

  const rules = [
    rule(`[data-ui-${key}${suffix}]`, `${property}: ${value}`, indent),
  ];

  if ("keywords" in styleProp) {
    for (const keyword of styleProp.keywords) {
      rules.push(
        rule(
          `[data-ui-${key}${suffix}="${keyword}"]`,
          `${property}: ${keyword}`,
          indent,
        ),
      );
    }
  }

  return rules;
}

/**
 * The CSS that resolves style props. `prepareComponentProps` puts each value
 * on the element as `data-ui-{key}` and a raw `--props-{key}`; these rules turn
 * the raw value into a declaration. A breakpoint value uses
 * `data-ui-{key}-{bp}` and applies under `@container style(--bp-{bp}: true)`.
 * Toggles are bare `data-ui-{key}` attributes with fixed declarations.
 *
 * Written to `@uiid/tokens/src/props.css` by `css.test.ts`, which fails when
 * the two drift apart.
 */
export function stylePropsCss() {
  const entries = Object.entries(styleProps) as [string, AnyStyleProp][];
  const blocks = entries.flatMap(([key, styleProp]) =>
    rulesFor(key, styleProp),
  );

  for (const [key, toggle] of Object.entries(toggleProps)) {
    const selector = `[data-ui-${key}]${"selector" in toggle ? toggle.selector : ""}`;
    const body = toggle.declarations.map((d) => `    ${d};`).join("\n");
    blocks.push(`  ${selector} {\n${body}\n  }`);
  }

  for (const bp of BREAKPOINTS) {
    const rules = entries.flatMap(([key, styleProp]) =>
      rulesFor(key, styleProp, `-${bp}`, "    "),
    );

    if (rules.length > 0) {
      blocks.push(
        `  @container style(--bp-${bp}: true) {\n${rules.join("\n\n")}\n  }`,
      );
    }
  }

  return `${HEADER}@layer uiid.props {\n${blocks.join("\n\n")}\n}\n`;
}

const HEADER = `/**
 * Generated from \`@uiid/utils\` style props — do not edit by hand.
 * Regenerate with \`pnpm test:run packages/utils -u\`.
 *
 * \`uiid.props\` sits after \`uiid.components\`, so a style prop beats a
 * component's own styles, and before \`uiid.states\`. Unlayered consumer CSS
 * beats every layer, so a consumer can override a style prop from a class.
 */
`;
