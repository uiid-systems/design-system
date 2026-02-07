import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { avatarPreviews } from "./previews";

/**
 * Avatar size values.
 */
export const AvatarSize = z.enum(["small", "medium", "large"]);

/**
 * Avatar orientation values.
 */
export const AvatarOrientation = z.enum(["horizontal", "vertical"]);

/**
 * Avatar component props schema.
 */
export const AvatarPropsSchema = z.object({
  /** User initials (fallback when no image) */
  initials: z.string(),
  /** User name */
  name: z.string(),
  /** User description or role */
  description: z.string().optional(),
  /** Size variant */
  size: AvatarSize.optional(),
  /** Layout orientation */
  orientation: AvatarOrientation.optional(),
  /** Props forwarded to the container */
  ContainerProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to the image */
  ImageProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to the initials text */
  InitialsProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to the name text */
  NameProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to the description text */
  DescriptionProps: z.record(z.string(), z.any()).optional(),
});

export type AvatarProps = z.infer<typeof AvatarPropsSchema>;

export const AvatarEntry: ComponentEntry<typeof AvatarPropsSchema> = {
  name: "Avatar",
  package: "@uiid/indicators",
  hasChildren: false,
  propsSchema: AvatarPropsSchema,
  description:
    "User avatar with initials fallback, name, and optional description",
  category: "indicators",
  defaults: {
    size: "medium",
    orientation: "horizontal",
  },
  previews: avatarPreviews,
  usage:
    "Use Avatar for user profiles. Pass initials as fallback, name for display. Use orientation for layout direction.",
};
