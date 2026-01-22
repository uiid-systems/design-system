"use client";

import type { PropDocumentation } from "@uiid/registry";

import { Card } from "@uiid/cards";
import { CodeInline } from "@uiid/code";
import { Stack } from "@uiid/layout";
import { Table } from "@uiid/tables";
import { Text } from "@uiid/typography";

type PropsTableProps = {
  props: PropDocumentation[];
};

export const PropsTable = ({ props }: PropsTableProps) => {
  if (props.length === 0) {
    return (
      <Text shade="muted" size={0}>
        No props defined for this component.
      </Text>
    );
  }

  const items = props.map((prop) => ({
    Name: <CodeInline>{prop.name}</CodeInline>,
    Type: (
      <Stack gap={1}>
        <CodeInline>{prop.type}</CodeInline>
        {prop.enumValues && prop.enumValues.length > 0 && (
          <Text size={-1} shade="muted">
            {prop.enumValues.join(" | ")}
          </Text>
        )}
      </Stack>
    ),
    Default:
      prop.defaultValue !== undefined ? (
        <CodeInline>{String(prop.defaultValue)}</CodeInline>
      ) : (
        <Text shade="muted" size={-1}>
          -
        </Text>
      ),
    Required: (
      <Text size={-1} shade={prop.required ? "foreground" : "muted"}>
        {prop.required ? "Yes" : "No"}
      </Text>
    ),
    Description: (
      <Text size={-1}>
        {prop.description || (
          <Text render={<span />} shade="muted">
            -
          </Text>
        )}
      </Text>
    ),
  }));

  return (
    <Card fullwidth transparent b={1} p={0} style={{ overflow: "hidden" }}>
      <Table bordered items={items} />
    </Card>
  );
};
PropsTable.displayName = "PropsTable";
