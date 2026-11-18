import { HomeIcon } from "@uiid/icons/house";

import { Breadcrumbs } from "./breadcrumbs";
import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  BreadcrumbsList,
  BreadcrumbsSeparator,
} from "./subcomponents";

/** Hash hrefs so following a link doesn't reload the page. */
export const Basic = () => (
  <Breadcrumbs
    items={[
      { label: "Home", value: "#home" },
      { label: "Components", value: "#components" },
      { label: "Breadcrumbs", value: "#breadcrumbs" },
    ]}
  />
);

export const WithIcon = () => (
  <Breadcrumbs
    items={[
      { label: "Home", value: "#home", icon: HomeIcon },
      { label: "Components", value: "#components" },
      { label: "Breadcrumbs", value: "#breadcrumbs" },
    ]}
  />
);

/** The subcomponents compose a trail by hand, e.g. with a custom separator. */
export const Composed = () => (
  <BreadcrumbsContainer>
    <BreadcrumbsList>
      <BreadcrumbsItem>
        <a href="#home">Home</a>
      </BreadcrumbsItem>
      <BreadcrumbsSeparator>›</BreadcrumbsSeparator>
      <BreadcrumbsItem aria-current="page">Breadcrumbs</BreadcrumbsItem>
    </BreadcrumbsList>
  </BreadcrumbsContainer>
);
