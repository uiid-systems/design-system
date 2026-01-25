import { Select as BaseSelect } from "@base-ui/react/select";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { SelectPopupProps } from "../select.types";
import styles from "../select.module.css";

export const SelectPopup = ({
  children,
  className,
  ...props
}: SelectPopupProps) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83801fb3-41cc-4a8e-a1bd-20c34a8ecb67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'select-popup.tsx:SelectPopup',message:'SelectPopup rendered',data:{hasClassName:!!className,stylesPopup:styles["select-popup"],stylesKeys:Object.keys(styles)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3-css-module-mismatch'})}).catch(()=>{});
  // #endregion
  return (
    <BaseSelect.Popup
      data-slot="select-popup"
      render={<Card p={2} gap={0} fullwidth data-is-popup />}
      className={cx(styles["select-popup"], className)}
      {...props}
    >
      {children}
    </BaseSelect.Popup>
  );
};
SelectPopup.displayName = "SelectPopup";
