import type { PreviewConfig } from "@uiid/registry";

export function encodeTree(tree: PreviewConfig["tree"]): string {
  return btoa(encodeURIComponent(JSON.stringify(tree)));
}
