import { cx } from "@uiid/utils";

import styles from "./carousel-control.module.css";

type CarouselControlProps = React.ComponentProps<"button">;

export const CarouselControl = ({
  children,
  className,
  ...props
}: CarouselControlProps) => {
  return (
    <button
      role="button"
      className={cx(styles["carousel-control"], className)}
      {...props}
    >
      {children}
    </button>
  );
};
CarouselControl.displayName = "CarouselControl";
