"use client";

import { Toggle, ToggleGroup } from "@uiid/interactive";
import { Stack } from "@uiid/layout";

import type { Tab } from "@/hooks/use-view-state";
import { RenderedJson } from "./rendered-json";
import { RenderedJsx } from "./rendered-jsx";
import styles from "./code-view.module.css";

type CodeViewProps = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  jsonInput: string;
  jsxCode: string;
  parseError: string | null;
  onJsonChange: (value: string) => void;
};

export const CodeView = ({
  tab,
  onTabChange,
  jsonInput,
  jsxCode,
  parseError,
  onJsonChange,
}: CodeViewProps) => {
  return (
    <Stack className={styles["code-view"]} fullwidth fullheight gap={3}>
      <div className={styles["tab-toggle"]}>
        <ToggleGroup
          value={[tab]}
          onValueChange={(values) => {
            const next = values[0] as Tab | undefined;
            if (next) onTabChange(next);
          }}
          size="sm"
        >
          <Toggle value="json">JSON</Toggle>
          <Toggle value="jsx">JSX</Toggle>
        </ToggleGroup>
      </div>

      <div className={styles["code-content"]}>
        {tab === "json" ? (
          <RenderedJson
            value={jsonInput}
            onValueChange={onJsonChange}
            parseError={parseError}
          />
        ) : (
          <RenderedJsx code={jsxCode} />
        )}
      </div>
    </Stack>
  );
};
CodeView.displayName = "CodeView";
