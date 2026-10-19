import { styleProps } from "./styles";
import { toggleProps } from "./styles/toggles";
import type { StyleProp } from "./types";

type AnyStyleProp = StyleProp<keyof React.CSSProperties>;

const kebab = (property: string) =>
  property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** The declaration value that turns a raw `--props-{key}` into CSS. */
function resolve(raw: string, unit: AnyStyleProp["unit"]) {
  if (unit === "none") return raw;
  if (unit === "px") return `calc(${raw} * 1px)`;
  return `calc(${raw} * var(${unit.variable}))`;
}

/**
 * Registers `--props-{key}` so it never inherits: a child without the prop
 * reads the initial value rather than its parent's, and the browser doesn't
 * copy every ancestor's style props down the tree. Numeric props are typed,
 * so a non-number is dropped instead of reaching the declaration.
 */
function registration(key: string, unit: AnyStyleProp["unit"]) {
  const typed =
    unit === "none"
      ? [`syntax: "*";`]
      : [`syntax: "<number>";`, `initial-value: 0;`];

  return [
    `@property --props-${key} {`,
    ...typed.map((line) => `  ${line}`),
    `  inherits: false;`,
    `}`,
  ].join("\n");
}

/**
 * The CSS that resolves style props. `prepareComponentProps` puts each value
 * on the element as `data-ui-{key}` and a raw `--props-{key}`; these rules turn
 * the raw value into a declaration. Toggles are bare `data-ui-{key}`
 * attributes with fixed declarations, written after the style props so a
 * toggle wins over a style prop it conflicts with.
 *
 * Written to `@uiid/tokens/src/props.css` by `pnpm generate:props`. CI runs it
 * with `--check`, which fails when the two drift apart.
 */
export function stylePropsCss() {
  const entries = Object.entries(styleProps) as [string, AnyStyleProp][];
  const registrations: string[] = [];
  const rules: string[] = [];

  for (const [key, styleProp] of entries) {
    const property = kebab(styleProp.property);

    registrations.push(registration(key, styleProp.unit));
    rules.push(
      `  [data-ui-${key}] {\n    ${property}: ${resolve(`var(--props-${key})`, styleProp.unit)};\n  }`,
    );

    for (const keyword of styleProp.keywords ?? []) {
      rules.push(
        `  [data-ui-${key}="${keyword}"] {\n    ${property}: ${keyword};\n  }`,
      );
    }
  }

  for (const [key, toggle] of Object.entries(toggleProps)) {
    const selector = `[data-ui-${key}]${"selector" in toggle ? toggle.selector : ""}`;
    const body = toggle.declarations.map((d) => `    ${d};`).join("\n");
    rules.push(`  ${selector} {\n${body}\n  }`);
  }

  return `${HEADER}${registrations.join("\n\n")}\n\n@layer uiid.props {\n${rules.join("\n\n")}\n}\n`;
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
