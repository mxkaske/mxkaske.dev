import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface LinkProps extends Omit<NextLinkProps, "href"> {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Link({ className, href, ...props }: LinkProps) {
  const internalLink = href?.toString().startsWith("/");
  const internalHash = href?.toString().startsWith("#");
  const isInternal = internalLink || internalHash;
  const externalLinkProps = !isInternal
    ? { target: "_blank", rel: "noreferrer" }
    : undefined;

  const Anchor = !isInternal ? "a" : NextLink;

  return (
    <Anchor
      className={twMerge(
        "text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground",
        className
      )}
      // @ts-ignore FIXME: Url only works in NextLink
      href={href}
      {...externalLinkProps}
      {...props}
    />
  );
}
