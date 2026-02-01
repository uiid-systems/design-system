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
          tooltip={triggerText}
          disabled={!code && !jsonValue}
          size="small"
          square
        >
          <CodeIcon />
        </Button>
      }
      {...props}
    >
      <Tabs
        evenly
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
          { label: "JSX", value: "jsx", render: <RenderedJsx code={code} /> },
        ]}
        keepMounted
      />
    </Sheet>
  );
};
RenderedSheet.displayName = "RenderedSheet";
