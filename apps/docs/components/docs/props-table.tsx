import path from "node:path";
import { withCustomConfig, type PropItem } from "react-docgen-typescript";

import { Stack, Table, Text } from "@uiid/design-system";

const ROOT = path.resolve(process.cwd(), "../..");

/**
 * Base UI is the one dependency whose props are part of our public API — our
 * components re-expose them by `Pick`ing from `BaseX.Root.Props`. Filtering all
 * of node_modules drops `open`, `onOpenChange`, `swipeDirection` and friends
 * from every overlay table, so it is allowed back through. React's own HTML
 * attributes still come from @types/react and stay filtered.
 */
const isExternalDeclaration = (fileName?: string) =>
  !!fileName &&
  fileName.includes("node_modules") &&
  !/@base-ui[/\\]/.test(fileName);

const parser = withCustomConfig(path.join(ROOT, "tsconfig.json"), {
  propFilter: (prop) =>
    !isExternalDeclaration(prop.parent?.fileName) &&
    !prop.declarations?.some((d) => isExternalDeclaration(d.fileName)),
  shouldExtractLiteralValuesFromEnum: true,
  savePropValueAsString: true,
});

const Mono = ({
  children,
  muted,
  primary,
}: React.PropsWithChildren<{ muted?: boolean; primary?: boolean }>) => (
  <Text
    family="mono"
    size={-1}
    shade={muted ? "muted" : undefined}
    color={primary ? "orange" : undefined}
  >
    {children}
  </Text>
);

const EMPTY = <Text shade="muted">—</Text>;

const formatType = (prop: PropItem) =>
  (prop.type.raw ?? prop.type.name).replace(/ \| undefined$/, "");

type PropsTableProps = {
  /** Path to a component within packages, e.g. "buttons/button" */
  of: string;
};

/**
 * Props table extracted from the component source with
 * react-docgen-typescript — inherited HTML/Base UI props are filtered
 * out, leaving locally declared props and variant unions.
 */
export function PropsTable({ of }: PropsTableProps) {
  const [pkg, component] = of.split("/");
  const file = path.join(
    ROOT,
    "packages",
    pkg,
    "src",
    component,
    `${component}.tsx`,
  );

  const target = component.replace(/-/g, "").toLowerCase();
  const docs = parser.parse(file);
  const doc =
    docs.find((d) => d.displayName.toLowerCase() === target) ?? docs[0];
  if (!doc) return null;

  const rows = Object.entries(doc.props)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, prop]) => ({
      prop: <Mono primary>{name}</Mono>,
      description: prop.description || EMPTY,
      default: prop.defaultValue ? (
        <Mono muted>{String(prop.defaultValue.value)}</Mono>
      ) : (
        EMPTY
      ),
      type: <Mono muted>{formatType(prop)}</Mono>,
    }));

  return (
    <Stack
      data-slot="props-table"
      className="overflow-auto"
      ax="stretch"
      fullwidth
      maxh={640}
    >
      <Table
        items={rows}
        footer={
          <Text weight="bold" size={-1}>
            {rows.length} props
          </Text>
        }
        stickyHeader
        stickyFooter
        bordered
        striped
      />
    </Stack>
  );
}
