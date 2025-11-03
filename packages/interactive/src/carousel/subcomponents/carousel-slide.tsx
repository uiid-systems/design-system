import { cx } from "@uiid/utils";

import styles from "./carousel-slide.module.css";

type CarouselSlideProps = React.ComponentProps<"div"> & {
  size?: React.CSSProperties["width"];
};

export const CarouselSlide = ({
  size = "100%",
  className,
  children,
  ...props
}: CarouselSlideProps) => {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cx(styles["carousel-slide"], className)}
      style={{ "--carousel-slide-size": size } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};
CarouselSlide.displayName = "CarouselSlide";
