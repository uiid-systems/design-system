/* One file per pattern, so importing one bundles none of the others. */
export * from "./credit-card";
export * from "./credit-card-expiry";
export * from "./date";
export * from "./ein";
export * from "./ipv4";
export * from "./isbn";
export * from "./mac-address";
export * from "./phone";
export * from "./ssn";
export * from "./time";
// Not `license-plate`: pnpm leaves the root LICENSE out of the tarball when a
// packed path contains "license" (packages/config/scripts/check-dist.mjs, check 7).
export * from "./vehicle-plate";
export * from "./zip-code";
export * from "./zip-code-extended";
