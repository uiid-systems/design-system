import { getServerPreset } from "@/lib/get-preset-css";
import { DocsHeader as DocsHeaderClient } from "./docs-header";

export async function DocsHeader() {
  const preset = await getServerPreset();
  return <DocsHeaderClient initialPreset={preset} />;
}
