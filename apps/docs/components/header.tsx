import {
  Breadcrumbs,
  Group,
  Input,
  Kbd,
  ToggleGroup,
  Toggle,
} from "@uiid/design-system";
import { SearchIcon, SunIcon, MoonIcon, MonitorIcon } from "@uiid/icons";

import { SHELL_SPACING, SHELL_BORDER_WIDTH } from "@/constants";

const BREADCRUMBS_ITEMS = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Contact", value: "/contact" },
];

export function Header() {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <HeaderBreadcrumbs />
      </HeaderGroup>
      <HeaderGroup>
        <HeaderSearch />
        <HeaderModeToggle />
      </HeaderGroup>
    </HeaderContainer>
  );
}

const HeaderContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Group
      data-slot="header-container"
      render={<header />}
      className="sticky top-0 bg-(--shade-background) z-1"
      ay="center"
      ax="space-between"
      gap={SHELL_SPACING}
      p={SHELL_SPACING}
      bb={SHELL_BORDER_WIDTH}
      fullwidth
    >
      {children}
    </Group>
  );
};
HeaderContainer.displayName = "HeaderContainer";

const HeaderGroup = ({ children }: React.PropsWithChildren) => {
  return (
    <Group data-slot="header-group" gap={SHELL_SPACING / 2}>
      {children}
    </Group>
  );
};
HeaderGroup.displayName = "HeaderGroup";

const HeaderBreadcrumbs = () => {
  return (
    <Breadcrumbs data-slot="header-breadcrumbs" items={BREADCRUMBS_ITEMS} />
  );
};
HeaderBreadcrumbs.displayName = "HeaderBreadcrumbs";

const HeaderSearch = () => {
  return (
    <Input
      data-slot="header-search"
      placeholder="Search"
      before={<SearchIcon />}
      after={<Kbd hotkey={["meta", "k"]} />}
      size="small"
    />
  );
};
HeaderSearch.displayName = "HeaderSearch";

const HeaderModeToggle = () => {
  return (
    <ToggleGroup size="sm" value={["light"]}>
      <Toggle value="light">
        <SunIcon />
      </Toggle>
      <Toggle value="dark">
        <MoonIcon />
      </Toggle>
      <Toggle value="system">
        <MonitorIcon />
      </Toggle>
    </ToggleGroup>
  );
};
HeaderModeToggle.displayName = "HeaderModeToggle";
