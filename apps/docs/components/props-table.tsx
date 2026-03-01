"use client";

import { CodeInline } from "@uiid/code";
import { Badge } from "@uiid/indicators";
import { Accordion } from "@uiid/interactive";
import { Box, Group, Stack } from "@uiid/layout";
import type { PropDocumentation } from "@uiid/registry";
import { Text } from "@uiid/typography";

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
    <Box bb={1}>
      <Stack gap={2}>
        <Group gap={3} ay="center" style={{ flexWrap: "wrap" }}>
          <Text size={0} weight="bold" mono>
            {prop.name}
          </Text>
          {prop.required && (
            <Badge tone="critical" size="small" hideIndicator>
              required
            </Badge>
          )}
          {!(prop.enumValues && prop.enumValues.length > 0) && (
            <Text size={-1} shade="muted" mono>
              {prop.type}
            </Text>
          )}
        </Group>

        {prop.enumValues && prop.enumValues.length > 0 && (
          <Group gap={2} style={{ flexWrap: "wrap" }}>
            {prop.enumValues.map((val) => (
              <CodeInline key={val}>{val}</CodeInline>
            ))}
          </Group>
        )}

        {(prop.description || prop.defaultValue !== undefined) && (
          <Group gap={2} ay="baseline" style={{ flexWrap: "wrap" }}>
            {prop.description && (
              <Text size={0} shade="muted">
                {prop.description}
              </Text>
            )}
            {prop.defaultValue !== undefined && (
              <Text size={-1} shade="halftone">
                Default: <CodeInline>{String(prop.defaultValue)}</CodeInline>
              </Text>
            )}
          </Group>
        )}
      </Stack>
    </Box>
  );
}

function PropsList({ props }: { props: PropDocumentation[] }) {
  return (
    <Box>
      {props.map((prop) => (
        <PropRow key={prop.name} prop={prop} />
      ))}
    </Box>
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

  return (
    <Accordion
      items={items}
      defaultValue={["props"]}
      multiple
      fullwidth
    />
  );
};
PropsTable.displayName = "PropsTable";
