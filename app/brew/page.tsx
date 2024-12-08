import React from "react";
import { allBrews } from "@/.content-collections/generated";
import { Metadata } from "next";
import Link from "next/link";
import { formatDay } from "@/lib/formats";

const TITLE = "brew.mxkaske.dev";
const DESCRIPTION = "Never. Stop. Brewing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://brew.mxkaske.dev"),
  twitter: {
    images: [`/api/og?title=${TITLE}&description=${DESCRIPTION}`],
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  openGraph: {
    type: "website",
    images: [`/api/og?title=${TITLE}&description=${DESCRIPTION}`],
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return (
    <div className="space-y-8">
      <h1 className="font-cal text-3xl text-foreground">
        Never. Stop. Brewing.
      </h1>
      <div className="flex flex-col gap-6 sm:gap-8">
        {allBrews
          .sort((a, b) => (a.date.getTime() > b.date.getTime() ? -1 : 1))
          .map((post) => {
            return (
              <Link key={post.slug} href={post.url} className="group">
                <p className="font-mono text-xs font-light text-muted-foreground">
                  <span>{formatDay(new Date(post.date))}</span>
                  <span className="mx-1">·</span>
                  <span>{post.readingTime}</span>
                </p>
                <p className="font-cal text-xl text-foreground group-hover:underline">
                  {post.title}
                </p>
                <p className="font-light text-muted-foreground">
                  {post.description}
                </p>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
