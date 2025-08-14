// import type { Meta, StoryObj } from "@storybook/react-vite";

// import { ChangelogViewer } from "../../../docs/src/components/changelog-viewer";
// import type { ChangelogData } from "../../../docs/src/types/changelog";

// // Import the generated changelog data
// import changelogDataJson from "../../../../packages/changelog.json";

// // Type assertion to ensure proper typing
// const changelogData = changelogDataJson as ChangelogData[];

// const meta = {
//   title: "Changelog",
//   component: ChangelogViewer,
//   parameters: {
//     layout: "padded",
//   },
// } satisfies Meta<typeof ChangelogViewer>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const Default: Story = {
//   name: "Changelog",
//   args: {
//     changelogs: changelogData,
//   },
// };

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Changelog",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Changelog" };
