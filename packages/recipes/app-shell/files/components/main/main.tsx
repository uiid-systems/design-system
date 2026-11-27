import type { MainProps } from "./main.types";
import { MainAside, MainContent, MainRoot } from "./subcomponents";

/** The page and the aside beside it, scrolling together under the header. */
export const Main = ({ aside, children, ...props }: MainProps) => {
  return (
    <MainRoot {...props}>
      <MainContent>{children}</MainContent>
      {aside && <MainAside>{aside}</MainAside>}
    </MainRoot>
  );
};
Main.displayName = "Main";
