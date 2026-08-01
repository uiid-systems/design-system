import { SiGithub, SiNpm, SiStorybook } from "@icons-pack/react-simple-icons";
import { Button } from "@uiid/design-system";

import { HeaderBreadcrumbs } from "@/components/breadcrumbs";
import { HeaderContainer, HeaderGroup } from "@/components/shell";

const REPO_URL = "https://github.com/uiid-systems/design-system";
const NPM_URL = "https://www.npmjs.com/package/@uiid/design-system";
/** @todo point at the deployed storybook once it has a home */
const STORYBOOK_URL = "#";

export function Header() {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <HeaderBreadcrumbs />
      </HeaderGroup>
      <HeaderGroup gap={0}>
        <Button
          nativeButton={false}
          render={<a href={REPO_URL} target="_blank" rel="noopener" />}
          tooltip="View on GitHub"
          variant="ghost"
          shape="square"
          size="xsmall"
        >
          <SiGithub />
        </Button>
        <Button
          nativeButton={false}
          render={<a href={NPM_URL} target="_blank" rel="noopener" />}
          tooltip="View on npm"
          variant="ghost"
          shape="square"
          size="xsmall"
        >
          <SiNpm />
        </Button>
        <Button
          nativeButton={false}
          render={<a href={STORYBOOK_URL} />}
          tooltip="Storybook (coming soon)"
          variant="ghost"
          shape="square"
          size="xsmall"
        >
          <SiStorybook />
        </Button>
      </HeaderGroup>
    </HeaderContainer>
  );
}
