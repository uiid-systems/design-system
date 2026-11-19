// Ambient CSS types. Stories pull package sources in without each package's
// `vite-env.d.ts`, and `vite/client` does not resolve from this app.
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.css" {}
