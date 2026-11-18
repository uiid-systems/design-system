/// <reference types="vite/client" />

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

/** Left for the consumer's bundler to replace; gates development-only warnings. */
declare const process: { env: { NODE_ENV?: string } };
