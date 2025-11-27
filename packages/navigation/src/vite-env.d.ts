/// <reference types="vite/client" />

// Declare CSS modules with named exports
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
