import React from "react";
import { allPosts } from "@/.contentlayer/generated";

export async function generateStaticParams() {
  return allPosts.map((c) => ({ slug: c.url }));
}

export default function BaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) {
  return <main className="container py-16 min-h-screen">{children}</main>;
}
