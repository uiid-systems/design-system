import { Bell, Globe, Settings } from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
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
    <rect width="300" height="160" fill="var(--theme-primary)" />
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
    <Card icon={Globe} title="Icon and title" />
    <Card
      icon={Settings}
      title="Icon, title, and action"
      action={<button>Action</button>}
    />
    <Card
      icon={Bell}
      title="Full header"
      description="Icon, title, description, and action."
      action={<button>Action</button>}
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
        <button>Cancel</button>
        <button>Save</button>
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

export const Polymorphic = () => (
  <Card
    render={<a href="#" />}
    maxw={420}
    icon={Globe}
    title="Linkable card"
    description="Rendered as <a>; gains the scale-on-hover affordance automatically."
  >
    <Text size={0} shade="muted">
      example.com / docs
    </Text>
  </Card>
);
