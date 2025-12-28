import { memo } from "react";

import { Group } from "@uiid/layout";

import styles from "../image.module.css";

export const ImageOverlay = memo(() => {
  return (
    <Group data-slot="image-overlay" className={styles["image-overlay"]}>
      <span>LOADING...</span>
    </Group>
  );
});
ImageOverlay.displayName = "ImageOverlay";
