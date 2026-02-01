import { CodeBlock, type CodeBlockProps } from "@uiid/code";

export type RenderedJsxProps = CodeBlockProps;

export const RenderedJsx = ({ ...props }: RenderedJsxProps) => {
  return (
    <CodeBlock
      language="tsx"
      filename="component.tsx"
      showLineNumbers
      rows={20}
      {...props}
    />
  );
};
RenderedJsx.displayName = "RenderedJsx";
