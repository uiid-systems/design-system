"use client";

import { CodeInline } from "@uiid/code";
import { Badge } from "@uiid/indicators";
import { Collapsible } from "@uiid/interactive";
import { Box, Group, Stack } from "@uiid/layout";
import type { PropDocumentation } from "@uiid/registry";
import { Text } from "@uiid/typography";
import type { PropCategory } from "@uiid/utils";

type PropsTableProps = {
  props: PropDocumentation[];
};

const STYLE_CATEGORY_META: Record<
  Exclude<PropCategory, "core" | "subcomponent">,
  { label: string; description: string }
> = {
  spacing: {
    label: "Spacing",
    description: "Margin and padding using the spacing scale",
  },
  layout: {
    label: "Layout",
    description: "Flexbox alignment and direction",
  },
  sizing: {
    label: "Sizing",
    description: "Width and height constraints",
  },
  border: {
    label: "Border",
    description: "Border width on each side",
  },
  toggle: {
    label: "Toggle",
    description: "Boolean flags for component variants",
  },
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

function CorePropsSection({ props }: { props: PropDocumentation[] }) {
  if (props.length === 0) return null;
  return (
    <Box>
      {props.map((prop) => (
        <PropRow key={prop.name} prop={prop} />
      ))}
    </Box>
  );
}

function StylePropsSection({ props }: { props: PropDocumentation[] }) {
  if (props.length === 0) return null;

  const byCategory = props.reduce(
    (acc, prop) => {
      const cat = prop.category as keyof typeof STYLE_CATEGORY_META;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(prop);
      return acc;
    },
    {} as Record<string, PropDocumentation[]>,
  );

  const categoryOrder = Object.keys(
    STYLE_CATEGORY_META,
  ) as (keyof typeof STYLE_CATEGORY_META)[];
  const availableCategories = categoryOrder.filter(
    (key) => byCategory[key]?.length > 0,
  );

  return (
    <Collapsible
      trigger={
        <Group gap={3} ay="center">
          <Text size={0} weight="bold">
            Style Props
          </Text>
          <Text size={-1} shade="muted">
            {props.length}
          </Text>
        </Group>
      }
    >
      <Stack gap={4} py={3}>
        {availableCategories.map((categoryKey) => {
          const categoryProps = byCategory[categoryKey];
          const meta = STYLE_CATEGORY_META[categoryKey];

          if (categoryKey === "toggle") {
            return (
              <Stack key={categoryKey} gap={2}>
                <Text size={0} weight="bold">
                  {meta.label}
                </Text>
                <Text size={-1} shade="muted">
                  {meta.description}
                </Text>
                {categoryProps.map((prop) => (
                  <Box key={prop.name} bb={1}>
                    <Group gap={3} ay="center">
                      <Text size={0} weight="bold" mono>
                        {prop.name}
                      </Text>
                      <Text size={-1} shade="muted" mono>
                        boolean
                      </Text>
                    </Group>
                  </Box>
                ))}
              </Stack>
            );
          }

          return (
            <Stack key={categoryKey} gap={2}>
              <Text size={0} weight="bold">
                {meta.label}
              </Text>
              <Text size={-1} shade="muted">
                {meta.description}
              </Text>
              <Group gap={2} style={{ flexWrap: "wrap" }}>
                {categoryProps.map((prop) => (
                  <CodeInline key={prop.name}>{prop.name}</CodeInline>
                ))}
              </Group>
            </Stack>
          );
        })}
      </Stack>
    </Collapsible>
  );
}

function getSlotName(propName: string): string {
  return propName.replace(/Props$/, "");
}

function SubcomponentPropsSection({ props }: { props: PropDocumentation[] }) {
  if (props.length === 0) return null;

  return (
    <Collapsible
      trigger={
        <Group gap={3} ay="center">
          <Text size={0} weight="bold">
            Slot Props
          </Text>
          <Text size={-1} shade="muted">
            {props.length}
          </Text>
        </Group>
      }
    >
      <Box py={3}>
        {props.map((prop) => (
          <Box key={prop.name} bb={1}>
            <Stack gap={2}>
              <Text size={0} weight="bold" mono>
                {prop.name}
              </Text>
              <Text size={0} shade="muted">
                {prop.description ||
                  `Forwarded to the internal ${getSlotName(prop.name)} element`}
              </Text>
            </Stack>
          </Box>
        ))}
      </Box>
    </Collapsible>
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

  return (
    <Stack gap={4} fullwidth>
      <CorePropsSection props={categorized.core} />
      <StylePropsSection props={categorized.style} />
      <SubcomponentPropsSection props={categorized.subcomponent} />
    </Stack>
  );
};
PropsTable.displayName = "PropsTable";
