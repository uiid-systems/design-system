"use client";

import { CodeInline } from "@uiid/code";
import { InfoIcon, AsteriskIcon } from "@uiid/icons";
import { Accordion } from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Tooltip } from "@uiid/overlays";
import type { PropDocumentation } from "@uiid/registry";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

type PropsTableProps = {
  props: PropDocumentation[];
};

type CategorizedProps = {
  core: PropDocumentation[];
  style: PropDocumentation[];
  subcomponent: PropDocumentation[];
};

function categorizeProps(props: PropDocumentation[]): CategorizedProps {
  const result: CategorizedProps = {
    core: [],
    style: [],
    subcomponent: [],
  };

  for (const prop of props) {
    const category = prop.category ?? "core";
    if (category === "subcomponent") {
      result.subcomponent.push(prop);
    } else if (category === "core") {
      result.core.push(prop);
    } else {
      result.style.push(prop);
    }
  }

  return result;
}

function getSlotDescription(propName: string): string {
  const slot = propName.replace(/Props$/, "");
  return `Forwarded to the internal ${slot} element`;
}

function PropRow({ prop }: { prop: PropDocumentation }) {
  return (
    <Group gap={2} fullwidth ay="center" bb={1} pb={1} minh={40}>
      <Group gap={2} ay="center" ax="start" minw={160}>
        {prop.required && (
          <AsteriskIcon size={12} className="text-(--tone-critical)" />
        )}
        <Text size={-1} weight="bold">
          {prop.name}
        </Text>
      </Group>

      {!(prop.enumValues && prop.enumValues.length > 0) && (
        <div>
          <CodeInline>{prop.type}</CodeInline>
        </div>
      )}

      {prop.enumValues && prop.enumValues.length > 0 && (
        <Group gap={2}>
          {prop.enumValues.map((val) => (
            <CodeInline
              key={val}
              className={cx({
                "text-(--theme-primary)": prop.defaultValue === val,
              })}
            >
              {val}
            </CodeInline>
          ))}
        </Group>
      )}

      {prop.description && (
        <div className="ml-auto">
          <Tooltip
            trigger={<InfoIcon size={14} />}
            ProviderProps={{ delay: 0 }}
            PositionerProps={{ side: "inline-start", sideOffset: 8 }}
          >
            <div className="max-w-80">{prop.description}</div>
          </Tooltip>
        </div>
      )}
    </Group>
  );
}

function PropsList({ props }: { props: PropDocumentation[] }) {
  return (
    <Stack fullwidth ax="stretch">
      {props.map((prop) => (
        <PropRow key={prop.name} prop={prop} />
      ))}
    </Stack>
  );
}

function makeTrigger(label: string, count: number) {
  return (
    <Group gap={3} ay="center">
      <Text weight="bold">{label}</Text>
      <Text size={-1} shade="muted">
        {count}
      </Text>
    </Group>
  );
}

export const PropsTable = ({ props }: PropsTableProps) => {
  if (props.length === 0) {
    return (
      <Text shade="muted" size={0}>
        No props defined for this component.
      </Text>
    );
  }

  const categorized = categorizeProps(props);

  // Add forwarding descriptions to subcomponent props that don't have one
  const subcomponentProps = categorized.subcomponent.map((prop) => ({
    ...prop,
    description: prop.description || getSlotDescription(prop.name),
  }));

  const items = [];

  if (categorized.core.length > 0) {
    items.push({
      value: "props",
      trigger: makeTrigger("Props", categorized.core.length),
      content: <PropsList props={categorized.core} />,
    });
  }

  if (categorized.style.length > 0) {
    items.push({
      value: "style",
      trigger: makeTrigger("Style Props", categorized.style.length),
      content: <PropsList props={categorized.style} />,
    });
  }

  if (subcomponentProps.length > 0) {
    items.push({
      value: "slots",
      trigger: makeTrigger("Slot Props", subcomponentProps.length),
      content: <PropsList props={subcomponentProps} />,
    });
  }

  return <Accordion items={items} defaultValue={["props"]} multiple />;
};
PropsTable.displayName = "PropsTable";
