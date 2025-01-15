import Image from "next/image";

export function DataTableCardImageLink() {
  return (
    <Image
      src="/assets/data-table.png"
      fill={true}
      alt="data-table"
      className="object-cover transition-transform group-hover/card:scale-105"
    />
  );
}
