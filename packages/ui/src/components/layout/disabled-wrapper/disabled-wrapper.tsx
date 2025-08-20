import { Box } from "../box/box";
import {
  ConditionalRender,
  type ConditionalRenderProps,
} from "../conditional-render/conditional-render";

import "./disabled-wrapper.styles.css";

export type DisabledProps = React.PropsWithChildren<{
  disabled: ConditionalRenderProps["condition"];
}>;

export const DisabledWrapper = ({ children, disabled }: DisabledProps) => {
  return (
    <ConditionalRender
      aria-disabled={disabled}
      data-disabled={disabled}
      condition={disabled}
      wrapper={<Box uiid="disabled-wrapper" />}
    >
      {children}
    </ConditionalRender>
  );
};
DisabledWrapper.displayName = "DisabledWrapper";
