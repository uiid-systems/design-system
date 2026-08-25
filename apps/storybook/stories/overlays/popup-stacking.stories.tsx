import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Autocomplete,
  Button,
  Combobox,
  Dialog,
  Menu,
  Popover,
  Select,
  Stack,
  Text,
  Toaster,
  ToastProvider,
  Tooltip,
  useToastManager,
} from "@uiid/design-system";

import { MOCK_AUTOCOMPLETE_ITEMS } from "../forms/autocomplete.mocks";
import { MOCK_COMBOBOX_ITEMS } from "../forms/combobox.mocks";
import { MOCK_SELECT_ITEMS } from "../forms/select.mocks";

const MOCK_MENU_ITEMS = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete" },
];

/**
 * Every portalled popup shares one stacking level with Dialog's and Drawer's
 * viewports, so a popup opened from inside a dialog paints on top of it. These
 * stories exist to be looked at: the regression they guard against is a paint
 * order, which jsdom does not compute and a unit test cannot assert.
 *
 * In each story, open the dialog and then open the popup inside it. The popup
 * must render above the dialog surface, not behind it.
 */
const meta = {
  title: "Overlays/Popup Stacking",
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          "Visual regression checks for popup z-index. Open the dialog, then open the popup inside it — the popup should appear above the dialog, never behind it.",
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The originally reported bug: Select sat below the dialog and was unusable. */
export const SelectInDialog: Story = {
  render: () => (
    <Dialog
      title="Select inside a dialog"
      description="The listbox should open above the dialog surface."
      trigger={<Button>Open dialog</Button>}
    >
      <Select
        label="Font"
        placeholder="Pick a font"
        items={MOCK_SELECT_ITEMS}
      />
    </Dialog>
  ),
};

/** The two form popups that previously set no z-index at all. */
export const TypeaheadsInDialog: Story = {
  render: () => (
    <Dialog
      title="Typeaheads inside a dialog"
      description="Both lists should open above the dialog surface."
      trigger={<Button>Open dialog</Button>}
    >
      <Stack gap={4}>
        <Combobox
          label="Combobox"
          placeholder="Search fruit"
          items={MOCK_COMBOBOX_ITEMS}
        />
        <Autocomplete
          label="Autocomplete"
          placeholder="Search fruit"
          items={MOCK_AUTOCOMPLETE_ITEMS}
        />
      </Stack>
    </Dialog>
  ),
};

/** Popover, Tooltip, and Menu carried the same latent bug outside of forms. */
export const OverlaysInDialog: Story = {
  render: () => (
    <Dialog
      title="Overlays inside a dialog"
      description="Each of these should render above the dialog surface."
      trigger={<Button>Open dialog</Button>}
    >
      <Stack gap={4}>
        <Popover title="Popover" trigger={<Button>Open popover</Button>}>
          <Text>This popover is anchored inside the dialog.</Text>
        </Popover>
        <Tooltip trigger={<Button>Hover for tooltip</Button>}>
          Tooltips share the same stacking level.
        </Tooltip>
        <Menu trigger={<Button>Open menu</Button>} items={MOCK_MENU_ITEMS} />
      </Stack>
    </Dialog>
  ),
};

const ToastButton = () => {
  const toastManager = useToastManager();
  return (
    <Button onClick={() => toastManager.add({ description: "Changes saved." })}>
      Fire a toast
    </Button>
  );
};

/**
 * Toasts sit above every popup: a toast confirming an action taken inside a
 * dialog has to be readable over it. The toast viewport is its own stacking
 * context, so it needs a level of its own rather than inheriting the popup one.
 */
export const ToastOverDialog: Story = {
  render: () => (
    <ToastProvider>
      <Dialog
        title="Toast fired from a dialog"
        description="The toast should appear above the dialog, not behind it."
        trigger={<Button>Open dialog</Button>}
      >
        <ToastButton />
      </Dialog>
      <Toaster />
    </ToastProvider>
  ),
};
