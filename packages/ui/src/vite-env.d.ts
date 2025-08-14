/// <reference types="vite/client" />

// Declare CSS files for side-effect imports (like import "./styles.css")
declare module "*.css" {
  const css: string;
  export default css;
}

// Declare CSS modules with named exports
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
