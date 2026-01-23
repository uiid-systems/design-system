import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Globe, X } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

export function CardPreview() {
  return (
    <Card
      icon={Globe}
      title="Acme Corporation"
      description="The global leader in everything."
      action={
        <Button tooltip="Close" size="xsmall" square ghost>
          <X />
        </Button>
      }
      footer={
        <Group gap={2} ax="end" fullwidth>
          <Button size="small" ghost>
            Cancel
          </Button>
          <Button size="small">Complete purchase</Button>
        </Group>
      }
    >
      <Text style={{ maxWidth: 380 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>
    </Card>
  );
}
