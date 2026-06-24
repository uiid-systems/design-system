import type { PreviewConfig } from "../../types";

export const avatarPreviews: PreviewConfig[] = [
  {
    label: "Horizontal",
    tree: {
      root: "avatars",
      elements: {
        avatars: {
          key: "avatars",
          type: "Stack",
          props: { gap: 4 },
          children: ["user1", "user2", "user3"],
        },
        user1: {
          key: "user1",
          type: "Avatar",
          props: {
            initials: "JD",
            name: "Jane Doe",
            description: "Software Engineer",
          },
          parentKey: "avatars",
        },
        user2: {
          key: "user2",
          type: "Avatar",
          props: {
            initials: "AB",
            name: "Alex Brown",
            description: "Product Manager",
          },
          parentKey: "avatars",
        },
        user3: {
          key: "user3",
          type: "Avatar",
          props: {
            initials: "MK",
            name: "Maria Kim",
            description: "Designer",
          },
          parentKey: "avatars",
        },
      },
    },
  },
  {
    label: "Vertical",
    tree: {
      root: "avatars",
      elements: {
        avatars: {
          key: "avatars",
          type: "Group",
          props: { gap: 6 },
          children: ["user1", "user2", "user3"],
        },
        user1: {
          key: "user1",
          type: "Avatar",
          props: {
            initials: "JD",
            name: "Jane Doe",
            description: "Engineering",
            orientation: "vertical",
          },
          parentKey: "avatars",
        },
        user2: {
          key: "user2",
          type: "Avatar",
          props: {
            initials: "AB",
            name: "Alex Brown",
            description: "Product",
            orientation: "vertical",
          },
          parentKey: "avatars",
        },
        user3: {
          key: "user3",
          type: "Avatar",
          props: {
            initials: "MK",
            name: "Maria Kim",
            description: "Design",
            orientation: "vertical",
          },
          parentKey: "avatars",
        },
      },
    },
  },
];
