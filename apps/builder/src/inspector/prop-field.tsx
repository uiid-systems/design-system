import { Input, NumberField, Select, Switch } from "@uiid/design-system";

import { useDocumentStore } from "../document/document.store";
import type { PropFieldProps } from "./inspector.types";

/** Select value that stands for "not set", which Base UI cannot express itself. */
const UNSET = "";

/**
 * One control per manifest prop, chosen from the docgen type and nothing else.
 * Every control writes through `setProp`; an empty value removes the prop.
 */
export function PropField({ nodeId, prop }: PropFieldProps) {
  const value = useDocumentStore(
    (s) => s.document.nodes[nodeId]?.props[prop.name],
  );
  const setProp = useDocumentStore((s) => s.setProp);
  const { name, description, defaultValue, type } = prop;

  if (type.value) {
    const unsetLabel = defaultValue
      ? `Default (${defaultValue.value})`
      : "Unset";
    return (
      <Select
        label={name}
        description={description}
        items={[
          { value: UNSET, label: unsetLabel },
          ...type.value.map(({ value: literal }) => ({
            value: literal,
            label: String(JSON.parse(literal)),
          })),
        ]}
        value={value === undefined ? UNSET : JSON.stringify(value)}
        onValueChange={(next: string | null) =>
          setProp(
            nodeId,
            name,
            next === UNSET || next === null ? undefined : JSON.parse(next),
          )
        }
        backdrop={false}
        fullwidth
      />
    );
  }

  if (type.name === "boolean") {
    return (
      // Finding, not a fix: SwitchProps picks the variant keys as required, so
      // the three must be spelled out even though the component defaults them.
      <Switch
        label={name}
        description={description}
        size="small"
        reversed={false}
        bordered={false}
        checked={value === true}
        onCheckedChange={(checked) =>
          setProp(nodeId, name, checked ? true : undefined)
        }
      />
    );
  }

  if (type.name === "number") {
    return (
      <NumberField
        label={name}
        description={description}
        value={typeof value === "number" ? value : null}
        onValueChange={(next) => setProp(nodeId, name, next ?? undefined)}
      />
    );
  }

  return (
    <Input
      label={name}
      description={description}
      value={typeof value === "string" ? value : ""}
      onValueChange={(next: string) => setProp(nodeId, name, next || undefined)}
      fullwidth
    />
  );
}
