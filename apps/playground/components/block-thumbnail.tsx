"use client";

import { Renderer } from "@json-render/react";

import type { UISpec } from "@/lib/catalog";
import { registry } from "@/lib/components";

import styles from "./block-thumbnail.module.css";

type BlockThumbnailProps = {
  spec: UISpec;
};

export const BlockThumbnail = ({ spec }: BlockThumbnailProps) => {
  return (
    <div data-slot="block-thumbnail" className={styles.frame}>
      <div className={styles.scaler}>
        <Renderer spec={spec} registry={registry} />
      </div>
    </div>
  );
};
BlockThumbnail.displayName = "BlockThumbnail";
