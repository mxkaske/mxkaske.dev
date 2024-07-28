import type { ColumnFiltersState } from "@tanstack/react-table";
import { z } from "zod";
import { DataTableFilterField } from "./types";

export function deserialize<T extends z.AnyZodObject>(schema: T) {
  const castToSchema = z.preprocess((val) => {
    if (typeof val !== "string") return val;
    return val
      .trim()
      .split(" ")
      .reduce(
        (prev, curr) => {
          const [name, value] = curr.split(":");
          if (!value || !name) return prev;

          if (value.includes(",")) {
            const values = value.split(",");
            prev[name] = values;
            return prev;
          }
          if (value.includes("-")) {
            const values = value.split("-");
            prev[name] = values;
            return prev;
          }
          prev[name] = [value];
          return prev;
        },
        {} as Record<string, unknown>,
      );
  }, schema);
  return (value: string) => castToSchema.safeParse(value);
}

// export function serialize<T extends z.AnyZodObject>(schema: T) {
//   return (value: z.infer<T>) =>
//     schema
//       .transform((val) => {
//         Object.keys(val).reduce((prev, curr) => {
//           if (Array.isArray(val[curr])) {
//             return `${prev}${curr}:${val[curr].join(",")} `;
//           }
//           return `${prev}${curr}:${val[curr]} `;
//         }, "");
//       })
//       .safeParse(value);
// }

export function serializeColumFilters<TData>(columnFilters: ColumnFiltersState, filterFields?: DataTableFilterField<TData>[]) {
  return columnFilters.reduce((prev, curr) => {
    if (Array.isArray(curr.value)) {
      if (filterFields?.find(field => curr.id === field.value)?.type === "slider") {
        return `${prev}${curr.id}:${curr.value.join("-")} `;
      } else {
        return `${prev}${curr.id}:${curr.value.join(",")} `;
      }
    }
    return `${prev}${curr.id}:${curr.value} `;
  }, "");
}

export function isArrayOfNumbers(arr: any[]): arr is number[] {
  return arr.every((item) => typeof item === "number");
}