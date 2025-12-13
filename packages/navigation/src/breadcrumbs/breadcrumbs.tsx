import { Fragment } from "react";
import { ConditionalRender, Group } from "@uiid/layout";

import type { BreadcrumbsProps } from "./breadcrumbs.types";

import {
  BreadcrumbsContainer,
  BreadcrumbsList,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
} from "./subcomponents";

const Breadcrumbs = ({
  items,
  linkAs: Link = "a",
  ...props
}: BreadcrumbsProps) => {
  return (
    <BreadcrumbsContainer uiid="breadcrumbs" {...props}>
      <BreadcrumbsList>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const Icon = item.icon;
          const content = (
            <ConditionalRender
              condition={Boolean(Icon)}
              render={<Group gap={2} ay="center" />}
            >
              {Icon && <Icon size={14} />}
              {item.label}
            </ConditionalRender>
          );
          return (
            <Fragment key={item.value}>
              <BreadcrumbsItem>
                {isLast ? content : <Link href={item.value}>{content}</Link>}
              </BreadcrumbsItem>
              {!isLast && <BreadcrumbsSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbsList>
    </BreadcrumbsContainer>
  );
};
Breadcrumbs.displayName = "Breadcrumbs";

export {
  Breadcrumbs,
  BreadcrumbsContainer,
  BreadcrumbsList,
  BreadcrumbsItem,
  BreadcrumbsSeparator,
};
