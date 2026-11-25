import type { CodeBlockHeaderProps } from "../code-block.types";
import { CodeBlockHeaderBase } from "./code-block-header-base";

/**
 * The bar above the code: language icon, filename and buttons. It renders from
 * its content, and with no filename, icon or children its buttons float over
 * the code instead.
 */
export const CodeBlockHeader = (props: CodeBlockHeaderProps) => (
  <CodeBlockHeaderBase {...props} />
);
CodeBlockHeader.displayName = "CodeBlockHeader";
