import { SiGithub, SiNpm, SiStorybook } from "@icons-pack/react-simple-icons";
import { Button } from "@uiid/design-system";

import { HeaderGroup } from "@/components/header";
import type { HeaderGroupProps } from "@/components/header";

const REPO_URL = "https://github.com/uiid-systems/design-system";
const NPM_URL = "https://www.npmjs.com/package/@uiid/design-system";
/** @todo point at the deployed storybook once it has a home */
const STORYBOOK_URL = "#";

export type HeaderLinksProps = HeaderGroupProps;

/** The project's links, passed to `Header` for its trailing end. */
export const HeaderLinks = (props: HeaderLinksProps) => {
  return (
    <HeaderGroup data-slot="header-links" gap={0} {...props}>
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
  );
};
HeaderLinks.displayName = "HeaderLinks";
