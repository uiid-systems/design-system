import type { PreviewConfig } from "../../types";

export const breadcrumbsPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "breadcrumbs",
      elements: {
        breadcrumbs: {
          key: "breadcrumbs",
          type: "Breadcrumbs",
          props: {
            items: [
              { label: "Home", value: "/" },
              { label: "Products", value: "/products" },
              { label: "Electronics", value: "/products/electronics" },
            ],
          },
        },
      },
    },
  },
  {
    label: "Long Path",
    tree: {
      root: "breadcrumbs",
      elements: {
        breadcrumbs: {
          key: "breadcrumbs",
          type: "Breadcrumbs",
          props: {
            items: [
              { label: "Home", value: "/" },
              { label: "Settings", value: "/settings" },
              { label: "Account", value: "/settings/account" },
              { label: "Security", value: "/settings/account/security" },
              { label: "Two-Factor Auth", value: "/settings/account/security/2fa" },
            ],
          },
        },
      },
    },
  },
];
