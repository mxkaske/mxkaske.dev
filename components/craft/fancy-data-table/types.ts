export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type Option = {
  label: string;
  value: string | boolean | number | undefined;
};

export type Input = {
  type: "input";
  options?: Option[];
};

export type Checkbox = {
  type: "checkbox";
  component?: (props: Option) => JSX.Element | null;
  options?: Option[];
};

export type Slider = {
  type: "slider";
  min: number;
  max: number;
  // if options is undefined, we will provide all the steps between min and max (increases )
  options?: Option[];
};

export type Base<TData> = {
  label: string;
  value: keyof TData;
};

export type DataTableCheckboxFilterField<TData> = Base<TData> & Checkbox;
export type DataTableSliderFilterField<TData> = Base<TData> & Slider;
export type DataTableInputFilterField<TData> = Base<TData> & Input;

export type DataTableFilterField<TData> =
  | DataTableCheckboxFilterField<TData>
  | DataTableSliderFilterField<TData>
  | DataTableInputFilterField<TData>;
