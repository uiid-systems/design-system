import { Button } from "@uiid/buttons";
import { CodeIcon } from "@uiid/icons";
import { Tabs } from "@uiid/interactive";
import { Sheet, type SheetProps } from "@uiid/overlays";

import { RenderedJson } from "./rendered-json";
import { RenderedJsx } from "./rendered-jsx";

type RenderedSheetProps = SheetProps & {
  code: string;
  jsonValue: string;
  onJsonChange: (value: string) => void;
  parseError?: string | null;
  onApply?: () => void;
  triggerText?: string;
};

export const RenderedSheet = ({
  code,
  jsonValue,
  onJsonChange,
  parseError,
  onApply,
  triggerText = "View source",
  ...props
}: RenderedSheetProps) => {
  return (
    <Sheet
      data-slot="rendered-sheet"
      title={triggerText}
      side="right"
      PopupProps={{ style: { width: "40rem" } }}
      trigger={
        <Button
          tooltip="View and edit JSON or JSX source"
          disabled={!code && !jsonValue}
          size="small"
          ghost
        >
          <CodeIcon />
          Code
        </Button>
      }
      {...props}
    >
      <Tabs
        evenly
        keepMounted
        RootProps={{ fullwidth: true, ax: "stretch" }}
        ContainerProps={{ pt: 4 }}
        items={[
          {
            label: "JSON",
            value: "json",
            render: (
              <RenderedJson
                value={jsonValue}
                onValueChange={onJsonChange}
                parseError={parseError}
                onApply={onApply}
              />
            ),
          },
          {
            label: "JSX",
            value: "jsx",
            render: <RenderedJsx code={code} style={{ width: "100%" }} />,
          },
        ]}
      />
    </Sheet>
  );
};
RenderedSheet.displayName = "RenderedSheet";
