import type { CodeBlockHeaderProps } from "../code-block.types";
import { CodeBlockHeaderBase } from "./code-block-header-base";

/**
 * The bar above the code: language icon, filename and buttons. It renders from
 * its content, and with no filename, icon or children its buttons float over
 * the code instead. Floating, it is `position: absolute` against its nearest
 * positioned ancestor, and only inside `CodeBlock` do the lines beside it keep
 * clear of the buttons.
 */
export const CodeBlockHeader = (props: CodeBlockHeaderProps) => (
  <CodeBlockHeaderBase {...props} />
);
CodeBlockHeader.displayName = "CodeBlockHeader";
