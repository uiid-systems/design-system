import { CodeBlock } from "@uiid/design-system";
import { useMemo } from "react";

import { useDocumentStore } from "../document/document.store";
import { emitTsx } from "../emit/emit-tsx";
import { manifest } from "../manifest/manifest";

/** The emitted module for the current document, re-emitted on every change. */
export function CodePanel() {
  const document = useDocumentStore((s) => s.document);
  const code = useMemo(() => emitTsx(document, manifest), [document]);

  return <CodeBlock code={code} language="tsx" filename="page.tsx" />;
}
