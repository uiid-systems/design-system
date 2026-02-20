// Types
export type { BlockFile, BlockCategory, BlockComplexity } from "./types";

// Individual block imports
import loginEmailGoogle from "./blocks/login-email-google.json";
import socialLoginEmailPassword from "./blocks/social-login-email-password.json";
import usernamePasswordCard from "./blocks/username-password-card.json";
import notificationCardWithIcon from "./blocks/notification-card-with-icon.json";
import addressBlockCard from "./blocks/address-block-card.json";
import wideAddressBlockCard from "./blocks/wide-address-block-card.json";
import workspaceRegistrationForm from "./blocks/workspace-registration-form.json";
import workspaceSettingsPage from "./blocks/workspace-settings-page.json";
import profileSettingsSwitches from "./blocks/profile-settings-switches.json";

import type { BlockFile } from "./types";

// Re-export individual blocks for tree-shaking
export {
  loginEmailGoogle,
  socialLoginEmailPassword,
  usernamePasswordCard,
  notificationCardWithIcon,
  addressBlockCard,
  wideAddressBlockCard,
  workspaceRegistrationForm,
  workspaceSettingsPage,
  profileSettingsSwitches,
};

// All blocks as a record keyed by slug
export const blocks: Record<string, BlockFile> = {
  "login-email-google": loginEmailGoogle as unknown as BlockFile,
  "social-login-email-password": socialLoginEmailPassword as unknown as BlockFile,
  "username-password-card": usernamePasswordCard as unknown as BlockFile,
  "notification-card-with-icon": notificationCardWithIcon as unknown as BlockFile,
  "address-block-card": addressBlockCard as unknown as BlockFile,
  "wide-address-block-card": wideAddressBlockCard as unknown as BlockFile,
  "workspace-registration-form": workspaceRegistrationForm as unknown as BlockFile,
  "workspace-settings-page": workspaceSettingsPage as unknown as BlockFile,
  "profile-settings-switches": profileSettingsSwitches as unknown as BlockFile,
};

// Utilities
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
