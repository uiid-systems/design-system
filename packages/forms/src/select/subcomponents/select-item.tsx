import { Select as BaseSelect } from "@base-ui/react/select";

import { ListItem } from "@uiid/lists";

import styles from "../select.module.css";
import type { SelectItemProps } from "../select.types";

export const SelectItem = ({
  value,
  label,
  description,
  icon,
  ...props
}: SelectItemProps) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83801fb3-41cc-4a8e-a1bd-20c34a8ecb67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'select-item.tsx:SelectItem',message:'SelectItem rendered',data:{value,label,stylesItem:styles["select-item"],stylesKeys:Object.keys(styles)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3-css-module-mismatch'})}).catch(()=>{});
  // #endregion
  return (
    <BaseSelect.Item
      data-slot="select-item"
      value={value}
      label={label}
      className={styles["select-item"]}
      {...props}
      render={(renderProps, state) => (
        <ListItem
          render={<div />}
          fullwidth
          value={value}
          label={label}
          description={description}
          icon={icon}
          selected={state.selected}
          {...renderProps}
        />
      )}
    />
  );
};
SelectItem.displayName = "SelectItem";
