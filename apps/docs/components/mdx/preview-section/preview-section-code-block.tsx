import { CodeBlock } from "@uiid/code";

import type { PreviewSectionCodeBlockProps } from "./preview-section.types";

export const PreviewSectionCodeBlock = ({
  code,
  prerenderedHtml,
}: PreviewSectionCodeBlockProps) => {
  return (
    <CodeBlock
      code={code}
      language="tsx"
      filename="Example.tsx"
      html={prerenderedHtml}
    />
  );
};
PreviewSectionCodeBlock.displayName = "PreviewSectionCodeBlock";
