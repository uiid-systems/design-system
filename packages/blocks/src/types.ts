export type BlockCategory = "authentication" | "forms" | "settings" | "cards" | "content";

export type BlockComplexity = "low" | "medium" | "high";

export type BlockFile = {
  name: string;
  slug: string;
  description: string;
  version: number;
  tags: string[];
  category: BlockCategory;
  components: string[];
  complexity: BlockComplexity;
  elementCount: number;
  tree: {
    root: string;
    elements: Record<
      string,
      {
        key: string;
        type: string;
        props: Record<string, unknown>;
        children?: string[];
        parentKey?: string;
        slot?: string;
      }
    >;
  };
  createdAt: string;
  updatedAt: string;
};
