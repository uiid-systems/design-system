// Reached through lucide's own module rather than its root, for the same
// module-graph reason as the icons. Types live in the .d.ts beside this file:
// lucide ships none for this path, and tsc would emit the bare specifier into
// dist, typing `createLucideIcon` as `any` for consumers.
export { default } from "lucide-react/dist/esm/createLucideIcon.mjs";
