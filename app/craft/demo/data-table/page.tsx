import { columns } from "@/components/craft/fancy-data-table/columns";
import {
  data,
  filterFields,
} from "@/components/craft/fancy-data-table/constants";
import { DataTable } from "@/components/craft/fancy-data-table/data-table";
import { columnFilterSchema } from "@/components/craft/fancy-data-table/schema";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const search = columnFilterSchema.safeParse(await searchParams);

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
