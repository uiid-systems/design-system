import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Card } from "./card";

const meta = {
  title: "Cards/Card",
  component: Card,
  args: {
    title: "Card Title",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  render: (args) => (
    <Group gap={2}>
      <Stack gap={4}>
        <Card {...args} size="sm" title="Small card" />
        <Card {...args} size="md" title="Medium card" />
        <Card {...args} size="lg" title="Large card" />
      </Stack>

      <Stack gap={4}>
        <Card {...args} variant="info" title="Info card" />
        <Card {...args} variant="warning" title="Warning card" />
        <Card {...args} variant="error" title="Error card" />
        <Card {...args} variant="success" title="Success card" />
        <Card {...args} variant="inverted" title="Inverted card" />
      </Stack>

      <Stack gap={4}>
        <Card {...args} href="https://example.com" title="Internal link card">
          When passed an <code>href</code> prop, the card will render as a link.
        </Card>
        <Card
          {...args}
          href="https://example.com"
          target="_blank"
          title="External link card"
        >
          When passed an <code>href</code> prop with{" "}
          <code>target="_blank"</code>, the card will render as a external link.
        </Card>
        <Card
          {...args}
          render={<NextLink href="https://example.com" target="_blank" />}
          title="Render prop link card"
        >
          When passed a <code>render</code> prop with an <code>href</code> prop,
          the card will render as a link. Useful for libraries like Next.js
          which use a custom Link component.
        </Card>
        <Card
          {...args}
          title="Card with actions"
          primaryAction={{ text: "Primary", onClick: () => {} }}
          secondaryAction={{ text: "Secondary", onClick: () => {} }}
        >
          When passed a <code>primaryAction</code>, <code>secondaryAction</code>
          , or <code>tertiaryAction</code> prop, the card will render a footer
          with a button for each action.
        </Card>
        <Card
          {...args}
          title="Card with dismiss handler"
          onDismiss={() => alert("Dismissed")}
        >
          When passed an <code>onDismiss</code> prop, the card will render a
          close button in the top right corner.
        </Card>
      </Stack>
    </Group>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Card" };

// Example simulating Next.js Link component
const NextLink = ({
  href,
  target,
  children,
  ...props
}: {
  href: string;
  target: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <a href={href} target={target} {...props}>
    {children}
  </a>
);
