import { SiGithub } from "@icons-pack/react-simple-icons";

import { Button } from "@uiid/design-system";

import { HeaderBreadcrumbs } from "@/components/breadcrumbs";
import { HeaderContainer, HeaderGroup } from "@/components/shell";

const REPO_URL = "https://github.com/uiid-systems/design-system";

export function Header() {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <HeaderBreadcrumbs />
      </HeaderGroup>
      <HeaderGroup>
        <Button
          variant="ghost"
          shape="square"
          nativeButton={false}
          render={<a href={REPO_URL} target="_blank" rel="noopener" />}
          aria-label="GitHub repository"
          tooltip="View on GitHub"
        >
          <SiGithub />
        </Button>
      </HeaderGroup>
    </HeaderContainer>
  );
}
