import { Breadcrumbs, Group, Input, Kbd } from "@uiid/design-system";
import { SearchIcon } from "@uiid/icons";

import { ModeToggle } from "@/components/mode-toggle";
import { SHELL_SPACING, SHELL_BORDER_WIDTH } from "@/constants";
import { SITEMAP } from "@/sitemap";

export function Header() {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <HeaderBreadcrumbs />
      </HeaderGroup>
      <HeaderGroup>
        <HeaderSearch />
        <ModeToggle />
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
  return <Breadcrumbs data-slot="header-breadcrumbs" items={SITEMAP} />;
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
