// lucide-react ships a per-icon ESM file for every icon (dist/esm/icons/*.mjs)
// but no matching .d.ts — its types all live in the single dist/lucide-react.d.ts.
// We import those files directly so a consumer build never has to parse lucide's
// root module; these declarations give the deep specifiers types.
//
// Safe to do because lucide-react's package.json has no `exports` field, so its
// internal paths are legitimately reachable. Revisit on a major lucide bump.

declare module "lucide-react/dist/esm/icons/*" {
  const icon: import("lucide-react").LucideIcon;
  export default icon;
}

declare module "lucide-react/dist/esm/createLucideIcon.mjs" {
  const createLucideIcon: typeof import("lucide-react").createLucideIcon;
  export default createLucideIcon;
}
