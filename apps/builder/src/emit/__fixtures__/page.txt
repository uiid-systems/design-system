import { Button, Card, Group, Stack, Text } from "@uiid/design-system";

export function Page() {
  return (
    <Stack gap={4} p={6}>
      <Card title="Welcome">
        <Text size={3} weight="bold">
          Hello
        </Text>
        <Text>Built with the UIID page builder.</Text>
        <Group gap={2}>
          <Button>Primary</Button>
          <Button variant="ghost">Secondary</Button>
        </Group>
      </Card>
    </Stack>
  );
}
