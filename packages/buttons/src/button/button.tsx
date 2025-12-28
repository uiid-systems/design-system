import { Button as BaseButton } from "@base-ui/react/button";

import { ConditionalRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";
import { ButtonTooltipWrapper } from "./subcomponents";
import { buttonVariants } from "./button.variants";
import { ButtonContentContainer } from "./subcomponents/button-content-container";

export const Button = ({
  /** tooltip */
  tooltip,
  /** variants */
  ghost,
  pill,
  grows,
  size,
  square,
  variant,
  /** misc */
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <ConditionalRender
      condition={!!tooltip}
      render={<ButtonTooltipWrapper tooltip={tooltip} />}
    >
      <BaseButton
        data-slot="button"
        className={cx(
          styles["button"],
          buttonVariants({ ghost, grows, pill, size, square, variant }),
          className,
        )}
        {...props}
      >
        <ButtonContentContainer>{children}</ButtonContentContainer>
      </BaseButton>
    </ConditionalRender>
  );
};
Button.displayName = "Button";
