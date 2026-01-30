import { PropsTable as BasePropsTable } from "@/components";
import type { PropDocumentation } from "@uiid/registry";

interface PropsTableProps {
  props: PropDocumentation[];
}

/**
 * MDX component to render a props table.
 * Props are passed from the page based on registry data.
 */
export function PropsTable({ props }: PropsTableProps) {
  return <BasePropsTable props={props} />;
}
