import type { UITree } from "@json-render/core";

import { Button } from "@uiid/buttons";
import { RefreshCwIcon, CircleCheckIcon, ShareIcon } from "@uiid/icons";
import { Group } from "@uiid/layout";

import type { ChatMessage } from "@/lib/use-chat";

import { RenderedSheet } from "./rendered-sheet";
import type { RenderedJsxProps } from "./rendered-jsx";

type ChatSidebarActionsProps = {
  clear: () => void;
  messages: ChatMessage[];
  copied: boolean;
  handleShare: () => void;
  tree: UITree | null;
  jsonValue: string;
  onJsonChange: (value: string) => void;
  parseError?: string | null;
  onApply?: () => void;
} & Pick<RenderedJsxProps, "code">;

export const ChatSidebarActions = ({
  clear,
  messages,
  copied,
  handleShare,
  tree,
  code,
  jsonValue,
  onJsonChange,
  parseError,
  onApply,
}: ChatSidebarActionsProps) => {
  return (
    <Group data-slot="chat-sidebar-actions" gap={2} p={2} ax="end">
      <Button
        data-slot="chat-sidebar-actions-clear"
        size="small"
        onClick={clear}
        disabled={messages.length === 0 && !tree}
        tooltip="Clear the UI you've created"
      >
        <RefreshCwIcon />
        Reset UI
      </Button>
      <Button
        data-slot="chat-sidebar-actions-share"
        size="small"
        tooltip="Save for later and/or share with others"
        onClick={handleShare}
        disabled={!tree || copied}
      >
        {copied ? <CircleCheckIcon /> : <ShareIcon />}
        {copied ? "Link copied!" : "Copy link"}
      </Button>
      <RenderedSheet
        code={code}
        jsonValue={jsonValue}
        onJsonChange={onJsonChange}
        parseError={parseError}
        onApply={onApply}
      />
    </Group>
  );
};
ChatSidebarActions.displayName = "ChatSidebarActions";
