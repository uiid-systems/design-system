import type { ComponentType } from "react";

import { AccordionThumbnail } from "./accordion";
import { AlertThumbnail } from "./alert";
import { AvatarThumbnail } from "./avatar";
import { BadgeThumbnail } from "./badge";
import { BoxThumbnail } from "./box";
import { BreadcrumbsThumbnail } from "./breadcrumbs";
import { ButtonThumbnail } from "./button";
import { CardThumbnail } from "./card";
import { CheckboxThumbnail } from "./checkbox";
import { CheckboxGroupThumbnail } from "./checkbox-group";
import { CollapsibleThumbnail } from "./collapsible";
import { DrawerThumbnail } from "./drawer";
import { FormThumbnail } from "./form";
import { GroupThumbnail } from "./group";
import { InputThumbnail } from "./input";
import { KbdThumbnail } from "./kbd";
import { LayerThumbnail } from "./layer";
import { ModalThumbnail } from "./modal";
import { NumberFieldThumbnail } from "./number-field";
import { PopoverThumbnail } from "./popover";
import { ProgressThumbnail } from "./progress";
import { RadioThumbnail } from "./radio";
import { RadioGroupThumbnail } from "./radio-group";
import { SelectThumbnail } from "./select";
import { SeparatorThumbnail } from "./separator";
import { SheetThumbnail } from "./sheet";
import { SliderThumbnail } from "./slider";
import { StackThumbnail } from "./stack";
import { StatusThumbnail } from "./status";
import { SwitchThumbnail } from "./switch";
import { TextThumbnail } from "./text";
import { TextareaThumbnail } from "./textarea";
import { TimelineThumbnail } from "./timeline";
import { ToasterThumbnail } from "./toaster";
import { ToggleButtonThumbnail } from "./toggle-button";
import { TooltipThumbnail } from "./tooltip";

/** Map component slugs to their thumbnail components. */
export const thumbnails: Record<string, ComponentType> = {
  accordion: AccordionThumbnail,
  alert: AlertThumbnail,
  avatar: AvatarThumbnail,
  badge: BadgeThumbnail,
  box: BoxThumbnail,
  breadcrumbs: BreadcrumbsThumbnail,
  button: ButtonThumbnail,
  card: CardThumbnail,
  checkbox: CheckboxThumbnail,
  "checkbox-group": CheckboxGroupThumbnail,
  collapsible: CollapsibleThumbnail,
  drawer: DrawerThumbnail,
  form: FormThumbnail,
  group: GroupThumbnail,
  input: InputThumbnail,
  kbd: KbdThumbnail,
  layer: LayerThumbnail,
  modal: ModalThumbnail,
  "number-field": NumberFieldThumbnail,
  popover: PopoverThumbnail,
  progress: ProgressThumbnail,
  radio: RadioThumbnail,
  "radio-group": RadioGroupThumbnail,
  select: SelectThumbnail,
  separator: SeparatorThumbnail,
  sheet: SheetThumbnail,
  slider: SliderThumbnail,
  stack: StackThumbnail,
  status: StatusThumbnail,
  switch: SwitchThumbnail,
  text: TextThumbnail,
  textarea: TextareaThumbnail,
  timeline: TimelineThumbnail,
  toaster: ToasterThumbnail,
  "toggle-button": ToggleButtonThumbnail,
  tooltip: TooltipThumbnail,
};
