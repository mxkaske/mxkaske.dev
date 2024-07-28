export type SearchParams = {
  [key: string]: string | string[] | undefined;
}

export type Option = {
  label: string;
  value: string | boolean;
}

export type Checkbox = {
  type: "checkbox";
  component?: (props: Option) => JSX.Element | null;
  options?: Option[];
}

export type Slider = {
  type: "slider";
  min: number;
  max: number;
}

export type Base<TData>  =  {
  label: string;
  value: keyof TData;
}

export type DataTableCheckboxFilterField<TData> = Base<TData> & Checkbox;
export type DataTableSliderFilterField<TData> = Base<TData> & Slider;

export type DataTableFilterField<TData> = DataTableCheckboxFilterField<TData> |  DataTableSliderFilterField<TData>
