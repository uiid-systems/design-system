import { cx } from "@uiid/utils";

import styles from "./kbd.module.css";

export const Kbd = ({ className, ...props }: React.ComponentProps<"kbd">) => {
  return (
    <kbd data-slot="kbd" className={cx(styles["kbd"], className)} {...props} />
  );
};
Kbd.displayName = "Kbd";

export const KbdGroup = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <kbd
      data-slot="kbd-group"
      className={cx(styles["kbd-group"], className)}
      {...props}
    />
  );
};
KbdGroup.displayName = "KbdGroup";
