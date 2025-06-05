// import Pre from "@/components/docs/pre";
// import Image from "@/components/docs/image";
import { FancyBox } from "@/components/craft/fancy-box";
import { CraftWrapper } from "@/components/mdx/craft-wrapper";
import { Link } from "@/components/mdx/link";
import { FancyArea } from "@/components/craft/fancy-area/fancy-area";
import { FancyMultiSelect } from "@/components/craft/fancy-multi-select";
import { Form as ServerActionForm } from "@/components/craft/server-action-experimental-hook/form";
import { DataTableCardImageLink } from "@/components/craft/data-table-card-image-link";
import { Container as ActivityCalendarContainer } from "@/components/craft/activity-calendar/container";
import { Container as WheelPickerContainer } from "@/components/craft/wheel-picker/container";
import { AddressCombobox } from "@/components/craft/google-places-autocomplete/address-combobox";

export const components = {
  // Image: Image,
  // pre: Pre,
  a: Link,
  CraftWrapper,
  FancyArea,
  FancyBox,
  FancyMultiSelect,
  ServerActionForm,
  ActivityCalendar: ActivityCalendarContainer,
  WheelPicker: WheelPickerContainer,
  DataTableCardImageLink,
  AddressCombobox,
};
