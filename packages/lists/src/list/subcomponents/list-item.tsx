import { cx } from "@uiid/utils";
import { ConditionalRender, Group } from "@uiid/layout";

import type { ListItemProps } from "../list.types";
import { ICON_SIZE_LARGE } from "../list.constants";
import styles from "../list.module.css";

import { ListTextBlock } from "./list-text-block";
import { ListSelectedIcon } from "./list-selected-icon";

export const ListItem = ({
  disabled,
  selected,
  render,
  className,
  href,
  target,
  rel,
  icon: Icon,
  label,
  description,
  LinkComponent,
  ...props
}: ListItemProps) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83801fb3-41cc-4a8e-a1bd-20c34a8ecb67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'list-item.tsx:ListItem',message:'ListItem rendered',data:{label,stylesListItem:styles["list-item"],allStyles:Object.keys(styles),hasClassName:!!className,computedClassName:cx(styles["list-item"],className)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1-missing-css'})}).catch(()=>{});
  // #endregion
  // Determine the link element to use
  const linkElement = LinkComponent ? (
    <LinkComponent href={href ?? ""} style={{ display: "contents" }}>
      {null}
    </LinkComponent>
  ) : (
    <a href={href} target={target} rel={rel} style={{ display: "contents" }} />
  );

  return (
    <ConditionalRender condition={!!href} render={linkElement}>
      <Group
        data-slot="list-item"
        render={render ?? <li />}
        ay="start"
        ax="space-between"
        gap={8}
        className={cx(styles["list-item"], className)}
        tabIndex={disabled ? -1 : 0}
        data-disabled={disabled ?? undefined}
        data-selected={selected}
        {...props}
      >
        <Group gap={3} ay="start" style={{ listStyleType: "none" }}>
          {Icon && (
            <Icon
              data-slot="list-item-icon"
              size={ICON_SIZE_LARGE}
              style={{ color: "var(--shade-foreground)" }}
            />
          )}
          <ListTextBlock
            data-slot="list-item-text"
            label={label}
            description={description}
          />
        </Group>
        {selected && !disabled && <ListSelectedIcon />}
      </Group>
    </ConditionalRender>
  );
};
ListItem.displayName = "ListItem";
