import { Breadcrumbs } from "@uiid/design-system";

import {
  HeaderContainer,
  HeaderGroup,
  HeaderSearch,
  HeaderModeToggle,
} from "@/components/shell";
import { SITEMAP } from "@/sitemap";

export function Header() {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <Breadcrumbs data-slot="header-breadcrumbs" items={SITEMAP} />
      </HeaderGroup>
      <HeaderGroup>
        <HeaderSearch />
        <HeaderModeToggle />
      </HeaderGroup>
    </HeaderContainer>
  );
}
