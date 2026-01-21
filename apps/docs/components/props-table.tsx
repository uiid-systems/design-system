"use client";

import type { PropDocumentation } from "@uiid/registry";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import {
  TableContainer,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@uiid/tables";
import { CodeInline } from "@uiid/code";

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

  return (
    <TableContainer>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>
                <CodeInline>{prop.name}</CodeInline>
              </TableCell>
              <TableCell>
                <Stack gap={1}>
                  <CodeInline>{prop.type}</CodeInline>
                  {prop.enumValues && prop.enumValues.length > 0 && (
                    <Text size={-1} shade="muted">
                      {prop.enumValues.join(" | ")}
                    </Text>
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                {prop.defaultValue !== undefined ? (
                  <CodeInline>{String(prop.defaultValue)}</CodeInline>
                ) : (
                  <Text shade="muted" size={-1}>
                    -
                  </Text>
                )}
              </TableCell>
              <TableCell>
                <Text size={-1} shade={prop.required ? "foreground" : "muted"}>
                  {prop.required ? "Yes" : "No"}
                </Text>
              </TableCell>
              <TableCell>
                <Text size={-1}>
                  {prop.description || (
                    <Text render={<span />} shade="muted">
                      -
                    </Text>
                  )}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </TableContainer>
  );
};
PropsTable.displayName = "PropsTable";
