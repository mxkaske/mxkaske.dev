"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Eye } from "lucide-react";

// TODO: use dynamicIO to fetch the views number

export function ViewsNumber() {
  const [value, setValue] = useState<number>();
  const params = useParams<{ slug: string }>();

  useEffect(() => {
    fetch(`/api/views?slug=${params.slug}`)
      .then((res) => res.text())
      .then((res) => setValue(parseInt(res)));
  }, [params.slug]);

  return (
    <div className="flex items-center gap-1">
      <Eye className="h-3 w-3" />
      {value === undefined ? (
        <Skeleton className="bg-muted-foreground/30 h-[15px] w-8" />
      ) : (
        new Intl.NumberFormat().format(value)
      )}
    </div>
  );
}
