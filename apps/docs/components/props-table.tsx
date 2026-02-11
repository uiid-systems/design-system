"use client";

import { SiMdnwebdocs } from "@icons-pack/react-simple-icons";
import Link from "next/link";

import { Card } from "@uiid/cards";
import { CodeInline } from "@uiid/code";
import { Badge } from "@uiid/indicators";
import { Accordion } from "@uiid/interactive";
import { Box, Group, Stack } from "@uiid/layout";
import type { PropDocumentation } from "@uiid/registry";
import { Table } from "@uiid/tables";
import { Text } from "@uiid/typography";
import { styleProps, type PropCategory } from "@uiid/utils";

import { MDN_CSS_URL } from "@/constants";

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function getMdnUrl(propName: string): string | undefined {
  const prop = styleProps[propName as keyof typeof styleProps];
  if (!prop) return undefined;
  return `${MDN_CSS_URL}/${toKebabCase(prop.property)}`;
}

function getCssProperty(propName: string): string | undefined {
  const prop = styleProps[propName as keyof typeof styleProps];
  if (!prop) return undefined;
  return toKebabCase(prop.property);
}

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
          <Text size={-1} shade="muted" mono>
            {prop.type}
          </Text>
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

  const categoryItems = availableCategories.map((categoryKey) => {
    const categoryProps = byCategory[categoryKey];
    const meta = STYLE_CATEGORY_META[categoryKey];

    return {
      value: categoryKey,
      trigger: (
        <Group gap={3} ay="center">
          <Text size={0} weight="bold">
            {meta.label}
          </Text>
          <Badge hideIndicator>{categoryProps.length}</Badge>
        </Group>
      ),
      content: (
        <Stack gap={3} fullwidth>
          {/* <Text size={0} shade="muted">
            {meta.description}
          </Text> */}
          <Table
            striped
            bordered
            items={categoryProps.map((prop) => ({
              propName: prop.name,
              type: <CodeInline>{prop.type}</CodeInline>,
              cssProperty: (
                <Text shade="muted" family="mono" size={-1}>
                  {getCssProperty(prop.name) ?? prop.description}
                </Text>
              ),
            }))}
            columns={["prop", "type", "cssProperty"]}
            formatHeader={(key) => {
              const headers: Record<string, string> = {
                prop: "Prop",
                type: "Type",
                cssProperty: "CSS Property",
              };
              return headers[key as string] || key;
            }}
            actions={{
              primary: [
                {
                  icon: SiMdnwebdocs,
                  tooltip: "View MDN docs",
                  wrapper: (button, item) => {
                    const url = getMdnUrl(item.propName);
                    return url ? (
                      <Link href={url} target="_blank">
                        {button}
                      </Link>
                    ) : (
                      button
                    );
                  },
                },
              ],
            }}
          />
        </Stack>
      ),
    };
  });

  return (
    <Card title="Style props" fullwidth mt={8}>
      <Accordion
        items={categoryItems}
        multiple
        RootProps={{
          fullwidth: true,
          ghost: true,
          style: { backgroundColor: "var(--shade-background)" },
        }}
      />
    </Card>
  );
}

function SubcomponentPropsSection({ props }: { props: PropDocumentation[] }) {
  if (props.length === 0) return null;

  return (
    <Stack gap={3}>
      <Text size={0} shade="muted">
        Forward props to internal subcomponents:
      </Text>
      <Group gap={2} style={{ flexWrap: "wrap" }}>
        {props.map((prop) => (
          <CodeInline key={prop.name}>{prop.name}</CodeInline>
        ))}
      </Group>
    </Stack>
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
  const hasMultipleCategories =
    [categorized.core, categorized.style, categorized.subcomponent].filter(
      (arr) => arr.length > 0,
    ).length > 1;

  if (!hasMultipleCategories) {
    if (categorized.core.length > 0) {
      return <CorePropsSection props={categorized.core} />;
    }
    if (categorized.style.length > 0) {
      return <StylePropsSection props={categorized.style} />;
    }
    if (categorized.subcomponent.length > 0) {
      return <SubcomponentPropsSection props={categorized.subcomponent} />;
    }
  }

  const items = [];

  if (categorized.core.length > 0) {
    items.push({
      value: "core",
      trigger: (
        <Group gap={3} ay="center">
          <Text weight="bold">Props</Text>
          <Text size={-1} shade="muted">
            {categorized.core.length}
          </Text>
        </Group>
      ),
      content: <CorePropsSection props={categorized.core} />,
    });
  }

  if (categorized.style.length > 0) {
    items.push({
      value: "style",
      trigger: (
        <Group gap={3} ay="center">
          <Text weight="bold">Style Props</Text>
          <Text size={-1} shade="muted">
            {categorized.style.length}
          </Text>
        </Group>
      ),
      content: <StylePropsSection props={categorized.style} />,
    });
  }

  if (categorized.subcomponent.length > 0) {
    items.push({
      value: "subcomponent",
      trigger: (
        <Group gap={3} ay="center">
          <Text weight="bold">Slot Props</Text>
          <Text size={-1} shade="muted">
            {categorized.subcomponent.length}
          </Text>
        </Group>
      ),
      content: <SubcomponentPropsSection props={categorized.subcomponent} />,
    });
  }

  return <Accordion items={items} defaultValue={["core"]} multiple fullwidth />;
};
PropsTable.displayName = "PropsTable";
