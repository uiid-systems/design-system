/**
 * @typedef {import('postcss').Plugin} Plugin
 * @typedef {import('postcss').AtRule} AtRule
 * @typedef {{ shouldWrap?: (filePath: string) => boolean }} PostcssLayerWrapperOptions
 */

/**
 * PostCSS plugin that wraps CSS output in a specified @layer,
 * while preserving existing @layer blocks at the top level.
 *
 * @param {string} layerName - The name of the layer to wrap CSS in (e.g., "uiid.components")
 * @param {PostcssLayerWrapperOptions} [options] - Plugin options
 * @returns {Plugin}
 */
module.exports = function postcssLayerWrapper(layerName, options = {}) {
  return {
    postcssPlugin: "postcss-layer-wrapper",
    Once(root, { AtRule, result }) {
      // Check if this file should be wrapped
      if (options.shouldWrap && result.opts?.from) {
        if (!options.shouldWrap(result.opts.from)) {
          return; // Skip wrapping this file
        }
      }
      // Extract all top-level @layer rules (to keep unwrapped)
      const existingLayers = [];
      const nodesToRemove = [];

      root.each((node) => {
        if (node.type === "atrule" && node.name === "layer") {
          existingLayers.push(node.clone());
          nodesToRemove.push(node);
        }
      });

      // Remove the extracted layers from the root
      nodesToRemove.forEach((node) => node.remove());

      // Only wrap if there are remaining rules
      if (root.nodes && root.nodes.length > 0) {
        // Create a new @layer rule and move all remaining content into it
        const layerRule = new AtRule({
          name: "layer",
          params: layerName,
        });

        // Move all remaining nodes into the layer
        const remainingNodes = root.nodes.slice();
        remainingNodes.forEach((node) => {
          node.remove();
          layerRule.append(node);
        });

        // Add back: first the existing layers (unwrapped), then our wrapped content
        existingLayers.forEach((layer) => root.append(layer));
        root.append(layerRule);
      } else {
        // No content to wrap, just add back the existing layers
        existingLayers.forEach((layer) => root.append(layer));
      }
    },
  };
};

module.exports.postcss = true;
