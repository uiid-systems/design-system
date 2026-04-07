"use client";

import { CodeInline } from "@uiid/code";
import { Group } from "@uiid/layout";
import { AsteriskIcon, InfoIcon } from "@uiid/icons";
import { Tooltip } from "@uiid/overlays";
import type { PropDocumentation } from "@uiid/registry";
import {
  TableContainer,
  TableRoot,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@uiid/tables";
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

const COLUMN_COUNT = 3;

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

function GroupHeaderRow({ label, count }: { label: string; count: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={COLUMN_COUNT}
        className="bg-(--shade-surface) pt-4 pb-2"
      >
        <Group gap={2} ay="center">
          <Text weight="bold" shade="muted">
            {label}
          </Text>
          <Text shade="muted">
            {count}
          </Text>
        </Group>
      </TableCell>
    </TableRow>
  );
}

function PropRow({ prop }: { prop: PropDocumentation }) {
  return (
    <TableRow>
      <TableCell>
        <Group gap={1} ay="center">
          {prop.required && (
            <AsteriskIcon size={10} className="text-(--shade-foreground)" />
          )}
          <Text weight="bold">
            {prop.name}
          </Text>
          {prop.description && (
            <Tooltip
              trigger={<InfoIcon size={12} className="text-(--shade-muted)" />}
              ProviderProps={{ delay: 0 }}
              PositionerProps={{ side: "inline-start", sideOffset: 8 }}
            >
              <div className="max-w-80">{prop.description}</div>
            </Tooltip>
          )}
        </Group>
      </TableCell>

      <TableCell>
        {prop.enumValues && prop.enumValues.length > 0 ? (
          <Group gap={1}>
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
        ) : (
          <CodeInline>{prop.type}</CodeInline>
        )}
      </TableCell>

      <TableCell>
        {prop.defaultValue != null ? (
          <CodeInline className="text-(--theme-primary)">
            {String(prop.defaultValue)}
          </CodeInline>
        ) : (
          <Text shade="muted">
            —
          </Text>
        )}
      </TableCell>
    </TableRow>
  );
}

export const PropsTable = ({ props }: PropsTableProps) => {
  if (props.length === 0) {
    return (
      <Text shade="muted">
        No props defined for this component.
      </Text>
    );
  }

  const categorized = categorizeProps(props);
  const hasMultipleCategories =
    [categorized.core, categorized.style, categorized.subcomponent].filter(
      (c) => c.length > 0,
    ).length > 1;

  const subcomponentProps = categorized.subcomponent.map((prop) => ({
    ...prop,
    description: prop.description || getSlotDescription(prop.name),
  }));

  return (
    <TableContainer>
      <TableRoot bordered>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categorized.core.length > 0 && (
            <>
              {hasMultipleCategories && (
                <GroupHeaderRow
                  label="Props"
                  count={categorized.core.length}
                />
              )}
              {categorized.core.map((prop) => (
                <PropRow key={prop.name} prop={prop} />
              ))}
            </>
          )}

          {categorized.style.length > 0 && (
            <>
              {hasMultipleCategories && (
                <GroupHeaderRow
                  label="Style Props"
                  count={categorized.style.length}
                />
              )}
              {categorized.style.map((prop) => (
                <PropRow key={prop.name} prop={prop} />
              ))}
            </>
          )}

          {subcomponentProps.length > 0 && (
            <>
              {hasMultipleCategories && (
                <GroupHeaderRow
                  label="Slot Props"
                  count={subcomponentProps.length}
                />
              )}
              {subcomponentProps.map((prop) => (
                <PropRow key={prop.name} prop={prop} />
              ))}
            </>
          )}
        </TableBody>
      </TableRoot>
    </TableContainer>
  );
};
PropsTable.displayName = "PropsTable";
