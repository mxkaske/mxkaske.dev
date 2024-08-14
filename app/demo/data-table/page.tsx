"use client";

import { columns } from "@/components/craft/fancy-data-table/columns";
import {
  data,
  filterFields,
} from "@/components/craft/fancy-data-table/constants";
import { DataTable } from "@/components/craft/fancy-data-table/data-table";
import { columnFilterSchema } from "@/components/craft/fancy-data-table/schema";
import { useEffect } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = columnFilterSchema.safeParse(searchParams);

  useEffect(() => {
    fetch(`/api/views?slug=${"data-table"}`, { method: "POST" });
  }, []);

  if (!search.success) {
    console.log(search.error);
    return null;
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      filterFields={filterFields}
      defaultColumnFilters={Object.entries(search.data).map(([key, value]) => ({
        id: key,
        value,
      }))}
    />
  );
}
