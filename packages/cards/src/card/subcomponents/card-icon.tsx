import { ConditionalRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CardIconProps } from "../card.types";
import styles from "../card.module.css";

export const CardIcon = ({
  icon: IconProp,
  render,
  className,
}: CardIconProps) => {
  return (
    <ConditionalRender condition={!!render} render={render!}>
      {IconProp ? (
        <IconProp
          data-slot="card-icon"
          className={cx(styles["card-icon"], className)}
        />
      ) : null}
    </ConditionalRender>
  );
};
CardIcon.displayName = "CardIcon";
