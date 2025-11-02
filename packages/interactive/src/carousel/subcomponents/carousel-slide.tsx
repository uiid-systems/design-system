import { cx } from "@uiid/utils";

import styles from "./carousel-slide.module.css";

export const CarouselSlide = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cx(styles["carousel-slide"], className)}
      {...props}
    >
      {children}
    </div>
  );
};
CarouselSlide.displayName = "CarouselSlide";
