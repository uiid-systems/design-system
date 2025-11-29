import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ListProps } from "@uiid/layout";

import { Home, Heart } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarList,
  SidebarTrigger,
  SidebarAppContainer,
  SidebarFooter,
  SidebarGroup,
} from "./sidebar";
import { SidebarProvider, useSidebar } from "./sidebar.context";

const MOCK_LINKS: ListProps["items"] = [
  {
    category: "Community",
    collapsible: true,
    icon: Home,
    items: [
      { label: "Leaderboards", value: "leaderboards" },
      { label: "Recent matches", value: "recent-matches" },
      { label: "Find a match", value: "find-a-match" },
    ],
  },
  {
    category: "Favorites",
    collapsible: true,
    icon: Heart,
    items: [
      { label: "Allie Hyde", value: "allie-hyde" },
      { label: "Sammy Shuffle", value: "sammy-shuffle" },
      { label: "Jimmy Biscuits", value: "jimmy-biscuits" },
      { label: "Bobby Tables", value: "bobby-tables" },
      { label: "Sally Sunshine", value: "sally-sunshine" },
    ],
  },
];

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Sidebar",
  render: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarAppContainer style={{ height: "200dvh" }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </SidebarAppContainer>
    </SidebarProvider>
  ),
};

const AppSidebar = () => {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Group gap={open ? 1 : 0} ay="center" fullwidth>
          {/* <Logo /> */}
          <Text
            data-hide-collapsed
            level={0}
            shade="accent"
            bold
            pl={open ? 2 : 0}
            style={{
              overflow: "hidden",
              alignContent: "center",
              textWrap: "nowrap",
              flex: open ? 1 : undefined,
            }}
          >
            UIID Design System
          </Text>
          <SidebarTrigger />
        </Group>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup category="Community">
          <SidebarList items={MOCK_LINKS} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Text level={0} bold>
          Sidebar footer
        </Text>
      </SidebarFooter>
    </Sidebar>
  );
};

// const Logo = () => {
//   const { open } = useSidebar();

//   return (
//     <div
//       style={{
//         display: open ? "block" : "none",
//         flex: 1,
//       }}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 926.17 334.46"
//         style={{ overflow: "visible", width: 108 }}
//       >
//         <path
//           style={{ fill: "tomato" }}
//           d="M144.17,334.46c-30.96,0-57.12-5.75-78.5-17.25-21.38-11.5-37.67-27.78-48.87-48.87C5.6,247.27,0,222.29,0,193.39V2.79h82.25v192.37c0,12.68,2.43,23.74,7.3,33.17,4.86,9.44,11.86,16.66,21.01,21.67,9.13,5.02,20.34,7.52,33.61,7.52s24.47-2.5,33.61-7.52c9.13-5.01,16.06-12.16,20.78-21.45,4.71-9.29,7.08-20.41,7.08-33.39V2.79h82.25v190.6c0,28.9-5.53,53.88-16.58,74.96-11.06,21.08-27.27,37.37-48.65,48.87-21.38,11.5-47.54,17.25-78.5,17.25Z"
//         />
//         <path
//           style={{ fill: "tomato" }}
//           d="M308.03,325.62V2.79h82.25v322.83h-82.25Z"
//         />
//         <path
//           style={{ fill: "gold" }}
//           d="M410.5,325.62V2.79h82.25v322.83h-82.25Z"
//         />
//         <path
//           style={{ fill: "gold" }}
//           d="M513.09,327.39V.14h82.25v327.25h-82.25ZM586.5,327.39v-76.95c23.66-.97,69.16,3.24,90.44-5.97,34.7-11.86,52.55-44.92,51.96-81.15.7-36.69-16.53-69.6-51.96-80.71-21.14-8.55-67.09-4.72-90.43-5.53V.14c38.74-.11,93.29-1.99,126.26,12.38,62.66,21.96,100.16,80.99,99.28,145.93,3.63,66.66-35.12,130.94-99.28,155.44-32.85,15.63-87.49,13.72-126.25,13.49Z"
//         />
//         <path
//           style={{ fill: "mediumseagreen" }}
//           d="M860.89,334.46l-61.47-23.88,48.65-142.4,68.1,24.76-55.28,141.51ZM819.76,115.12V27.56h86.68v87.56h-86.68Z"
//         />
//       </svg>
//     </div>
//   );
// };
