import { CodeInline, Text } from "@uiid/design-system";

type PropsTableProps = {
  /** Path to a component within packages, e.g. "buttons/button" */
  of: string;
};

/**
 * Props tables are off until the docs app is rebuilt. They were extracted with
 * react-docgen-typescript, which needs the TypeScript compiler API, and
 * TypeScript 7.0 ships none. Until then this points the reader to the file
 * that types the component's props.
 */
export function PropsTable({ of }: PropsTableProps) {
  const [pkg, component] = of.split("/");
  const types = `packages/${pkg}/src/${component}/${component}.types.ts`;

  return (
    <Text data-slot="props-table" render={<p />} emphasis="muted">
      The props table is not available yet. The props are typed in{" "}
      <CodeInline>{types}</CodeInline>.
    </Text>
  );
}
