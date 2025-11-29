import * as React from "react";

import {
  BreadcrumbsList,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "./subcomponents";

function Breadcrumbs({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumbs" data-slot="breadcrumbs" {...props} />;
}

export { Breadcrumbs, BreadcrumbsList, BreadcrumbsItem, BreadcrumbsSeparator };
