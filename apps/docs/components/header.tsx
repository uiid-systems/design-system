import { HeaderBreadcrumbs } from "@/components/breadcrumbs";
import {
  HeaderContainer,
  HeaderGroup,
  HeaderSearch,
  HeaderModeToggle,
} from "@/components/shell";

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
