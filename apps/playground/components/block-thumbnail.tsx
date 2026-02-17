"use client";

import { Renderer } from "@json-render/react";

import { Card } from "@uiid/cards";
import { Group } from "@uiid/layout";

import type { UISpec } from "@/lib/catalog";
import { registry } from "@/lib/components";

import styles from "./block-thumbnail.module.css";

type BlockThumbnailProps = {
  spec: UISpec;
};

export const BlockThumbnail = ({ spec }: BlockThumbnailProps) => {
  return (
    <Card data-slot="block-thumbnail" fullwidth className={styles.frame}>
      <Group ax="center" p={8} className={styles.scaler}>
        <div>
          <Renderer spec={spec} registry={registry} />
        </div>
      </Group>
    </Card>
  );
};
BlockThumbnail.displayName = "BlockThumbnail";
