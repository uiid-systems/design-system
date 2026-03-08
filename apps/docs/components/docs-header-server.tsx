import { getServerPreset } from "./theme-style";
import { DocsHeader as DocsHeaderClient } from "./docs-header";

export async function DocsHeader() {
  const preset = await getServerPreset();
  return <DocsHeaderClient initialPreset={preset} />;
}
