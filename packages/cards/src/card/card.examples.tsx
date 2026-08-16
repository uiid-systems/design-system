import { Button } from "@uiid/buttons";
import { BellIcon } from "@uiid/icons/bell";
import { GlobeIcon } from "@uiid/icons/globe";
import { SettingsIcon } from "@uiid/icons/settings";
import { Group, Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { Text } from "@uiid/typography";

import { Card } from "./card";

const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const Thumb = () => (
  <svg
    viewBox="0 0 300 160"
    fill="none"
    style={{ width: "100%", height: "auto", display: "block" }}
  >
    <rect width="300" height="160" fill="var(--color-red-500)" />
    <circle cx="80" cy="80" r="36" fill="var(--shade-background)" />
    <rect
      x="140"
      y="62"
      width="120"
      height="14"
      rx="4"
      fill="var(--shade-background)"
    />
    <rect
      x="140"
      y="86"
      width="80"
      height="12"
      rx="4"
      fill="var(--shade-background)"
      opacity="0.7"
    />
  </svg>
);

export const Default = () => (
  <Card
    maxw={420}
    title="Card title"
    description="A short supporting description that sits beneath the title."
  >
    {BODY}
  </Card>
);

export const HeaderVariants = () => (
  <Stack gap={4} maxw={420}>
    <Card title="Title only">{BODY}</Card>
    <Card description="Description only" />
    <Card title="Title" description="And a supporting description" />
    <Card icon={GlobeIcon} title="Icon and title" />
    <Card
      icon={SettingsIcon}
      title="Icon, title, and action"
      action={<Button size="xsmall">Action</Button>}
    />
    <Card
      icon={BellIcon}
      title="Full header"
      description="Icon, title, description, and action."
      action={<Button size="xsmall">Action</Button>}
    >
      {BODY}
    </Card>
  </Stack>
);

export const Thumbnail = () => (
  <Card
    maxw={320}
    title="Card with thumbnail"
    description="The thumbnail slot renders flush above the header."
    thumbnail={<Thumb />}
  >
    {BODY}
  </Card>
);

export const Footer = () => (
  <Card
    maxw={420}
    title="Notification preferences"
    description="Choose how and when you'd like to be notified."
    footer={
      <Group gap={2} ax="end" fullwidth>
        <Button size="small" variant="subtle">
          Cancel
        </Button>
        <Button size="small">Save</Button>
      </Group>
    }
  >
    {BODY}
  </Card>
);

export const Trimmed = () => (
  <Card
    p={0}
    maxw={320}
    title="Trimmed"
    description="Padding removed so a thumbnail can sit edge-to-edge."
    thumbnail={<Thumb />}
  />
);

const HueCard = ({ color }: { color: (typeof PALETTE_HUES)[number] }) => (
  <Card
    color={color}
    icon={GlobeIcon}
    title={color.charAt(0).toUpperCase() + color.slice(1)}
    maxw={320}
    description="bg, fg, and border derive from one palette hue."
    FooterProps={{ ax: "end" }}
    action={
      <Button
        size="xsmall"
        shape="square"
        variant="subtle"
        color={color}
        aria-label={`${color} settings`}
      >
        <SettingsIcon />
      </Button>
    }
    footer={
      <>
        <Button size="xsmall" variant="subtle" color={color}>
          Cancel
        </Button>
        <Button size="xsmall" color={color}>
          Submit
        </Button>
      </>
    }
  >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus dolor ipsa
    beatae, illum iusto eos necessitatibus quibusdam sequi similique?
  </Card>
);

export const ColorSurfaces = () => (
  <Group gap={3} style={{ flexWrap: "wrap" }}>
    {PALETTE_HUES.map((color) => (
      <HueCard key={color} color={color} />
    ))}
  </Group>
);

export const Polymorphic = () => (
  <Card
    render={<a href="#" />}
    maxw={420}
    icon={GlobeIcon}
    title="Linkable card"
    description="Rendered as <a>; gains the scale-on-hover affordance automatically."
  >
    <Text size={0} shade="muted">
      example.com / docs
    </Text>
  </Card>
);
