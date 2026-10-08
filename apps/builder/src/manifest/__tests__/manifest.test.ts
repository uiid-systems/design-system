import * as designSystem from "@uiid/design-system";

import { components } from "../components";
import { builderMeta, manifest } from "../manifest";
import type { ManifestKey } from "../manifest";
import type { PropItem } from "../manifest.types";

/** The prop table from SPEC.md, "Manifest shape". */
const specProps: Record<ManifestKey, string[]> = {
  Stack: ["gap", "p", "ax", "ay"],
  Group: ["gap", "p", "ax", "ay"],
  Card: ["title", "description", "variant", "color"],
  Text: ["children", "size", "weight", "family", "shade"],
  Button: ["children", "variant", "size", "fullwidth", "disabled"],
  Input: ["label", "description", "placeholder", "size", "disabled"],
};

/**
 * Each component's own default, copied from its `.constants.ts`:
 * TEXT_DEFAULT_SIZE, TEXT_DEFAULT_FAMILY, BUTTON_DEFAULT_SIZE,
 * INPUT_DEFAULT_SIZE, CARD_DEFAULT_COLOR.
 */
const componentDefaults: Record<string, Record<string, string>> = {
  Text: { size: "0", family: "sans" },
  Button: { size: "medium" },
  Input: { size: "medium" },
  Card: { color: "neutral" },
};

const keys = Object.keys(manifest) as ManifestKey[];

describe("manifest", () => {
  it("lists exactly the six palette components", () => {
    expect(keys.sort()).toEqual(
      ["Button", "Card", "Group", "Input", "Stack", "Text"].sort(),
    );
  });

  it.each(keys)("%s: displayName equals its key", (key) => {
    expect(manifest[key].displayName).toBe(key);
  });

  it.each(keys)("%s: exposes every prop in the spec table", (key) => {
    expect(Object.keys(manifest[key].props).sort()).toEqual(
      [...specProps[key]].sort(),
    );
  });

  it.each(keys)("%s: every prop's name matches its record key", (key) => {
    for (const [name, prop] of Object.entries(manifest[key].props)) {
      expect(prop.name).toBe(name);
    }
  });

  it("populates type.value for every union prop with literal source text", () => {
    const unions = keys.flatMap((key) =>
      Object.values(manifest[key].props).filter((p) => p.type.name === "enum"),
    );
    expect(unions.length).toBeGreaterThan(0);

    for (const prop of unions) {
      expect(prop.type.value, prop.name).toBeDefined();
      expect(prop.type.value!.length, prop.name).toBeGreaterThan(0);
      for (const { value } of prop.type.value!) {
        // docgen stores union members as TypeScript literal source
        // (`"sans"`, `3`, `true`), so JSON.parse yields the runtime value.
        expect(() => JSON.parse(value), `${prop.name}: ${value}`).not.toThrow();
      }
    }
  });

  it.each(Object.entries(componentDefaults))(
    "%s: defaultValue matches the component's own default",
    (key, defaults) => {
      const props: Record<string, PropItem> =
        manifest[key as ManifestKey].props;
      for (const [name, value] of Object.entries(defaults)) {
        expect(props[name].defaultValue).toEqual({ value });
      }
    },
  );

  it("every defaultValue is one of the union's members", () => {
    for (const key of keys) {
      for (const prop of Object.values(manifest[key].props)) {
        if (!prop.defaultValue || !prop.type.value) continue;
        const members = prop.type.value.map(({ value }) => JSON.parse(value));
        const def = prop.defaultValue.value;
        // docgen leaves the default unquoted, so a numeric default needs coercing
        expect(
          members.includes(def) || members.includes(Number(def)),
          `${key}.${prop.name}: ${def}`,
        ).toBe(true);
      }
    }
  });
});

describe("builderMeta", () => {
  it("marks Stack, Group, and Card as the only containers", () => {
    const containers = keys.filter((key) => builderMeta[key].container);
    expect(containers.sort()).toEqual(["Card", "Group", "Stack"]);
  });

  it.each(keys)("%s: every default key is a manifest prop", (key) => {
    for (const name of Object.keys(builderMeta[key].defaults)) {
      expect(manifest[key].props, name).toHaveProperty(name);
    }
  });
});

describe("components", () => {
  it.each(keys)("%s: maps to the design-system export", (key) => {
    expect(components[key]).toBe(
      designSystem[key as keyof typeof designSystem],
    );
  });
});
