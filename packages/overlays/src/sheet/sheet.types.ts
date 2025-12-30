import type { Dialog as BaseSheet } from "@base-ui/react/dialog";

import type { VariantProps } from "@uiid/utils";

import { sheetVariants } from "./sheet.variants";

export type SheetVariants = VariantProps<typeof sheetVariants>;

export type SheetRootProps = BaseSheet.Root.Props;
export type SheetTriggerProps = BaseSheet.Trigger.Props;
export type SheetPortalProps = BaseSheet.Portal.Props;
export type SheetBackdropProps = BaseSheet.Backdrop.Props;
export type SheetPopupProps = BaseSheet.Popup.Props & SheetVariants;
export type SheetCloseProps = BaseSheet.Close.Props;

export type SheetProps = SheetVariants &
  React.PropsWithChildren<{
    title?: string;
    trigger?: React.ReactNode;
    RootProps?: SheetRootProps;
    TriggerProps?: SheetTriggerProps;
    PortalProps?: SheetPortalProps;
    BackdropProps?: SheetBackdropProps;
    PopupProps?: SheetPopupProps;
  }> &
  Partial<Pick<SheetRootProps, "open" | "onOpenChange">>;
