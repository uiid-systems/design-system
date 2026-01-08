import { createViteConfig } from "../../vite.config";

export default createViteConfig({
  external: ["date-fns", "react-day-picker"],
  preserveDirectives: false,
});
