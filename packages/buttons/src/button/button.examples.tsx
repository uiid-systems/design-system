import { ExternalLinkIcon } from "@uiid/icons/external-link";
import { GlobeIcon } from "@uiid/icons/globe";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Button } from "./button";
import type { ButtonColor } from "./button.types";

const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "neutral",
] as const satisfies readonly ButtonColor[];

export const Default = () => <Button>Travel the world</Button>;

export const Variants = () => (
  <Group gap={2}>
    <Button>Default</Button>
    <Button variant="subtle">Subtle</Button>
    <Button variant="ghost">Ghost</Button>
  </Group>
);

export const Sizes = () => (
  <Group gap={2} ay="center">
    <Button size="xsmall">xsmall</Button>
    <Button size="small">small</Button>
    <Button size="medium">medium</Button>
    <Button size="large">large</Button>
  </Group>
);

export const Shapes = () => (
  <Group gap={2}>
    <Button shape="square">
      <GlobeIcon />
    </Button>
    <Button shape="circle">
      <GlobeIcon />
    </Button>
    <Button shape="pill">
      <GlobeIcon />
      Pill
    </Button>
  </Group>
);

export const WithIcon = () => (
  <Group gap={2}>
    <Button>
      <GlobeIcon />
      Travel the world
    </Button>
    <Button variant="subtle">
      Read more
      <ExternalLinkIcon />
    </Button>
    <Button shape="square" aria-label="Globe">
      <GlobeIcon />
    </Button>
  </Group>
);

export const Disabled = () => (
  <Group gap={2}>
    <Button disabled>Default</Button>
    <Button disabled variant="subtle">
      Subtle
    </Button>
    <Button disabled variant="ghost">
      Ghost
    </Button>
  </Group>
);

export const Loading = () => (
  <Group gap={2}>
    <Button loading>Submitting</Button>
    <Button loading variant="subtle">
      Subtle
    </Button>
    <Button loading shape="square" aria-label="Loading" />
  </Group>
);

export const Fullwidth = () => (
  <Stack gap={2} fullwidth>
    <Button fullwidth color="green">
      Fullwidth
    </Button>
    <Button color="red">Not fullwidth</Button>
  </Stack>
);

export const Colors = () => (
  <Stack gap={3}>
    <Group gap={2}>
      {COLORS.map((color) => (
        <Button key={color} color={color}>
          {color}
        </Button>
      ))}
    </Group>
    <Group gap={2}>
      {COLORS.map((color) => (
        <Button key={color} color={color} variant="subtle">
          {color}
        </Button>
      ))}
    </Group>
    <Group gap={2}>
      {COLORS.map((color) => (
        <Button key={color} color={color} variant="ghost">
          {color}
        </Button>
      ))}
    </Group>
  </Stack>
);

export const WithTooltip = () => (
  <Button tooltip="Opens in a new tab">
    <GlobeIcon />
    Hover me
  </Button>
);

export const Polymorphic = () => (
  <Button
    nativeButton={false}
    render={<a href="https://example.com" target="_blank" rel="noopener" />}
    tooltip={
      <Text size={-1}>
        Set <Text weight="bold">nativeButton={`{false}`}</Text> when rendering
        as a link
      </Text>
    }
  >
    example.com
    <ExternalLinkIcon />
  </Button>
);
