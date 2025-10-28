// Re-export all icons from lucide-react
export * from "lucide-react";

// Re-export the main types that might be useful
export type {
  LucideProps as IconProps,
  LucideIcon as Icon,
} from "lucide-react";

// Custom components
export {
  LoadingSpinner,
  type LoadingSpinnerProps,
} from "./components/loading-spinner";
