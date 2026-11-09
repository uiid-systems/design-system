import compositionsCss from "@uiid/tokens/compositions.css?raw";

/** Splits a selector list on its top-level commas, leaving nested lists whole. */
const splitSelectorList = (list: string) => {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of list) {
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    current += char;
  }
  return [...parts, current.trim()];
};

/**
 * Whether `element` is in the state a composition in `compositions.css` is
 * gated on. Test-only: the test DOM loads none of that layered CSS, and
 * happy-dom rejects a list of relative arms inside `:has()`, so this reads the
 * real `:where(…)` list off the stylesheet source and runs each `:has` arm as
 * a `:scope` query instead.
 */
export const matchesComposition = (element: Element | null, name: string) => {
  const match = compositionsCss.match(
    new RegExp(`\\.composes-${name}:where\\(([\\s\\S]*?\\))\\s*\\{`),
  );
  if (!match) throw new Error(`No :where() state on .composes-${name}`);
  if (!element) return false;
  const arms = splitSelectorList(match[1].slice(0, -1));
  return arms.some((arm) => {
    const relative = arm.match(/^:has\((.*)\)$/s);
    if (!relative) return element.matches(arm);
    const scoped = splitSelectorList(relative[1]).map(
      (child) => `:scope ${child}`,
    );
    return element.querySelector(scoped.join(", ")) !== null;
  });
};
