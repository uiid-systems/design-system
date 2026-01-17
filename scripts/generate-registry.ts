#!/usr/bin/env npx tsx
/**
 * generate-registry.ts
 *
 * Scaffold for automated registry generation from UIID components.
 * Currently logs component structure to inform future automation.
 *
 * Usage:
 *   npx tsx scripts/generate-registry.ts
 *
 * Future goals:
 * 1. Parse *.types.ts files to extract prop interfaces
 * 2. Parse *.variants.ts files to extract CVA variant options
 * 3. Convert TypeScript types to Zod schemas
 * 4. Generate schemas/*.ts files automatically
 * 5. Update manifest.ts with new components
 */

import * as fs from "node:fs";
import * as path from "node:path";

const PACKAGES_DIR = path.resolve(import.meta.dirname, "../packages");
const REGISTRY_DIR = path.resolve(PACKAGES_DIR, "registry/src");

// Packages to scan for components
const TARGET_PACKAGES = [
  "layout",
  "buttons",
  "forms",
  "typography",
  "cards",
  "indicators",
  "interactive",
  "overlays",
  "navigation",
  "tables",
];

interface ComponentInfo {
  name: string;
  package: string;
  hasTypes: boolean;
  hasVariants: boolean;
  hasSubcomponents: boolean;
  files: string[];
}

/**
 * Scan a package directory for component folders.
 */
function scanPackage(packageName: string): ComponentInfo[] {
  const packageSrcDir = path.join(PACKAGES_DIR, packageName, "src");

  if (!fs.existsSync(packageSrcDir)) {
    console.warn(`Package not found: ${packageName}`);
    return [];
  }

  const components: ComponentInfo[] = [];
  const entries = fs.readdirSync(packageSrcDir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip non-directories and special files
    if (!entry.isDirectory()) continue;
    if (entry.name === "subcomponents") continue;
    if (entry.name.startsWith("_")) continue;

    const componentDir = path.join(packageSrcDir, entry.name);
    const files = fs.readdirSync(componentDir);

    // Check for standard component files
    const componentName = entry.name;
    const hasTypes = files.some((f) => f.endsWith(".types.ts"));
    const hasVariants = files.some((f) => f.endsWith(".variants.ts"));
    const hasSubcomponents = files.includes("subcomponents");

    components.push({
      name: kebabToPascal(componentName),
      package: `@uiid/${packageName}`,
      hasTypes,
      hasVariants,
      hasSubcomponents,
      files,
    });
  }

  return components;
}

/**
 * Convert kebab-case to PascalCase.
 */
function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Main entry point.
 */
function main() {
  console.log("UIID Registry Generator (Scaffold)\n");
  console.log("=".repeat(50));

  const allComponents: ComponentInfo[] = [];

  for (const packageName of TARGET_PACKAGES) {
    const components = scanPackage(packageName);
    allComponents.push(...components);

    if (components.length > 0) {
      console.log(`\n📦 @uiid/${packageName}`);
      console.log("-".repeat(30));

      for (const component of components) {
        const markers = [
          component.hasTypes ? "T" : "-",
          component.hasVariants ? "V" : "-",
          component.hasSubcomponents ? "S" : "-",
        ].join("");

        console.log(`  [${markers}] ${component.name}`);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`\nTotal components found: ${allComponents.length}`);
  console.log("\nLegend: T=types, V=variants, S=subcomponents");

  // Summary by coverage
  const withTypes = allComponents.filter((c) => c.hasTypes).length;
  const withVariants = allComponents.filter((c) => c.hasVariants).length;

  console.log(`\nCoverage:`);
  console.log(`  With types:    ${withTypes}/${allComponents.length}`);
  console.log(`  With variants: ${withVariants}/${allComponents.length}`);

  // Check registry coverage
  console.log("\n" + "=".repeat(50));
  console.log("\nRegistry Status:");

  const registryManifestPath = path.join(REGISTRY_DIR, "manifest.ts");
  if (fs.existsSync(registryManifestPath)) {
    const manifestContent = fs.readFileSync(registryManifestPath, "utf-8");

    const inRegistry = allComponents.filter((c) =>
      manifestContent.includes(`${c.name}Entry`)
    );
    const notInRegistry = allComponents.filter(
      (c) => !manifestContent.includes(`${c.name}Entry`)
    );

    console.log(`  In registry:     ${inRegistry.length}/${allComponents.length}`);
    console.log(`  Not in registry: ${notInRegistry.length}`);

    if (notInRegistry.length > 0 && notInRegistry.length <= 20) {
      console.log(`\nComponents not yet in registry:`);
      for (const c of notInRegistry) {
        console.log(`  - ${c.name} (${c.package})`);
      }
    }
  } else {
    console.log("  Registry manifest not found");
  }

  console.log("\n✨ Done!\n");
}

main();

