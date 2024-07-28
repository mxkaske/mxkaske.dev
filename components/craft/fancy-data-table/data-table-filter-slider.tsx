"use client";

import useUpdateSearchParams from "@/hooks/use-update-search-params";
import type { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { DataTableSliderFilterField } from "./types";
import { InputWithAddons } from "@/components/ui/input-with-addons";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { isArrayOfNumbers } from "./utils";

type DataTableFilterCheckboxProps<TData> = DataTableSliderFilterField<TData> & {
  table: Table<TData>;
};

// TBD: add debounce to reduce to number of filters
// TODO: extract onChange

export function DataTableFilterSlider<TData>({
  table,
  value: _value,
  min,
  max,
}: DataTableFilterCheckboxProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();
  const router = useRouter();
  const column = table.getColumn(value);
  const filterValue = column?.getFilterValue();

  const filters =
    typeof filterValue === "number"
      ? [filterValue, filterValue]
      : Array.isArray(filterValue) && isArrayOfNumbers(filterValue)
      ? filterValue
      : undefined;

  const updatePageSearchParams = useCallback(
    (values: Record<string, string | null>) => {
      const newSearchParams = updateSearchParams(values);
      router.replace(`?${newSearchParams}`, { scroll: false });
    },
    [router, updateSearchParams]
  );

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-4">
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`min-${value}`}
            className="px-2 text-muted-foreground"
          >
            Min.
          </Label>
          <InputWithAddons
            placeholder="from"
            trailing="ms"
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`min-${value}`}
            id={`min-${value}`}
            value={`${filters?.[0] ?? min}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              const newValue =
                Array.isArray(filters) && val < filters[1]
                  ? [val, filters[1]]
                  : [val, max];
              column?.setFilterValue(newValue);
              // @ts-expect-error FIXME:
              updatePageSearchParams({
                [value]: newValue,
              });
            }}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`max-${value}`}
            className="px-2 text-muted-foreground"
          >
            Max.
          </Label>
          <InputWithAddons
            placeholder="to"
            trailing="ms"
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`max-${value}`}
            id={`max-${value}`}
            value={`${filters?.[1] ?? max}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              const newValue =
                Array.isArray(filters) && val > filters[0]
                  ? [filters[0], val]
                  : [min, val];
              column?.setFilterValue(newValue);
              // @ts-expect-error FIXME:
              updatePageSearchParams({
                [value]: newValue,
              });
            }}
          />
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        value={filters || [min, max]}
        onValueChange={(values) => {
          column?.setFilterValue(values);
          // @ts-expect-error FIXME:
          updatePageSearchParams({
            [value]: values,
          });
        }}
      />
    </div>
  );
}
