import { SiGithub, SiNpm, SiStorybook } from "@icons-pack/react-simple-icons";
import { Button } from "@uiid/design-system";

import { NPM_URL, REPO_URL, STORYBOOK_URL } from "../header.constants";
import type { HeaderLinksProps } from "../header.types";
import { HeaderGroup } from "./header-group";

/** The project's links, at the trailing end of the header. */
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
