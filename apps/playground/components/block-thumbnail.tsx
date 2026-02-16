"use client";

import type { Spec } from "@json-render/core";
import { Renderer } from "@json-render/react";

import { registry } from "@/lib/components";

import styles from "./block-thumbnail.module.css";

type BlockThumbnailProps = {
  spec: Spec;
};

export const BlockThumbnail = ({ spec }: BlockThumbnailProps) => {
  return (
    <div className={styles.frame}>
      <div className={styles.scaler}>
        <Renderer spec={spec} registry={registry} />
      </div>
    </div>
  );
};
BlockThumbnail.displayName = "BlockThumbnail";
