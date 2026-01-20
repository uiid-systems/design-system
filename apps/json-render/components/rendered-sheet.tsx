import { Button } from "@uiid/buttons";
import { CodeIcon } from "@uiid/icons";
import { Tabs } from "@uiid/interactive";
import { Sheet, type SheetProps } from "@uiid/overlays";

import { RenderedJson, type RenderedJsonProps } from "./rendered-json";
import { RenderedJsx } from "./rendered-jsx";

type RenderedSheetProps = SheetProps & {
  code: string;
  jsonValue: string;
  onJsonChange: (value: string) => void;
  parseError?: string | null;
  onApply?: () => void;
};

const TITLE = "Code";

export const RenderedSheet = ({
  code,
  jsonValue,
  onJsonChange,
  parseError,
  onApply,
  children,
  ...props
}: RenderedSheetProps) => {
  return (
    <Sheet
      data-slot="rendered-sheet"
      title={TITLE}
      trigger={
        <Button size="small" disabled={!code && !jsonValue}>
          <CodeIcon /> {TITLE}
        </Button>
      }
      side="right"
      {...props}
    >
      <Tabs
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
