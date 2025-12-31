import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Collapsible } from "./collapsible";

import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "./subcomponents";

const meta: Meta<typeof Collapsible> = {
  title: "Interactive/Collapsible",
  component: Collapsible,
  tags: ["beta"],
  args: {},
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Collapsible
        {...args}
        trigger={<button>This is a simple collapsible</button>}
      >
        A simple component is a single component primarily configured via props.
      </Collapsible>

      <CollapsibleRoot>
        <CollapsibleTrigger>
          <button>This is a composed collapsible</button>
        </CollapsibleTrigger>
        <CollapsiblePanel>
          A composed component is composed of multiple components (i.e. root,
          trigger, panel).
        </CollapsiblePanel>
      </CollapsibleRoot>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Collapsible" };
