"use client";

import { cn } from "@/lib/utils";
import { Name } from "./name";
import { Link } from "@/components/mdx/link";
import { Fragment, useEffect } from "react";
import { useState } from "react";

function subdomain() {
  if (typeof window === "undefined") {
    return null;
  }

  const host = window.location.host;
  const subdomain = host.split(".")[0];
  return subdomain;
}

const level = [
  {
    name: "Home",
    href: "https://www.mxkaske.dev",
    active: "wwww",
  },
  {
    name: "Craft",
    href: "https://craft.mxkaske.dev",
    active: "craft",
  },
  {
    name: "Brew",
    href: "https://brew.mxkaske.dev",
    active: "brew",
  },
];

export function Header({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setActive(subdomain() ?? null);
  }, []);

  return (
    <header
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div>
        <Name />
      </div>
      <div>
        {level.map((item, index) => (
          <Fragment key={item.name}>
            <Link
              href={item.href}
              className={cn(active === item.active && "decoration-foreground")}
              internal
            >
              {item.name}
            </Link>
            {index < level.length - 1 && (
              <span className="mx-2 text-muted-foreground">·</span>
            )}
          </Fragment>
        ))}
      </div>
    </header>
  );
}
