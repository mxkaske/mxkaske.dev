import { allPhotos } from "@/.content-collections/generated";
import { PhotoImage } from "@/components/gallery/photo-image";
import { formatDay } from "@/lib/formats";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { BasicLayout } from "../_components/basic-layout";

const TITLE = "gallery.mxkaske.dev";
const DESCRIPTION = "Never. Stop. Looking.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://gallery.mxkaske.dev"),
  twitter: {
    images: [`/api/og/gallery`],
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  openGraph: {
    type: "website",
    images: [`/api/og/gallery`],
    title: TITLE,
    description: DESCRIPTION,
  },
};

// The first few tiles are above the fold — load them eagerly so they mostly
// skip the placeholder entirely and keep LCP fast.
const EAGER = 3;

const sortedPhotos = [...allPhotos].sort((a, b) =>
  a.date.getTime() > b.date.getTime() ? -1 : 1,
);

export default function Page() {
  return (
    <BasicLayout>
      <div className="space-y-8">
        <h1 className="font-cal text-3xl text-foreground">
          Never. Stop. Looking.
        </h1>
        {/* Uniform row tracks: every row is exactly one track tall, so rows line up
          no matter what mix of orientations lands in them. Orientation decides
          only how many columns a tile spans. The cost is a mild crop — uniform
          height and full-width rows can't both hold while also preserving every
          aspect ratio. Full frames live on the permalink page. */}
        <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:grid-cols-4">
          {sortedPhotos.map((photo, index) => {
            const wide = photo.orientation === "horizontal";
            return (
              <Link
                key={photo.slug}
                href={photo.url}
                className={cn("group relative", wide && "col-span-2")}
              >
                <PhotoImage
                  photo={photo}
                  crop
                  priority={index < EAGER}
                  sizes={
                    wide
                      ? "(min-width: 640px) 330px, 100vw"
                      : "(min-width: 640px) 170px, 50vw"
                  }
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8",
                      "translate-y-2 opacity-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                      "group-hover:translate-y-0 group-hover:opacity-100",
                      // Keyboard users tab to the link, so mirror hover on focus.
                      "group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                      // Touch devices never hover — leave it visible there.
                      "[@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
                    )}
                  >
                    {/* One line each — a narrow tile would otherwise wrap the
                      title to three lines and push the overlay up the frame. */}
                    <p className="truncate font-cal text-sm text-white">
                      {photo.title}
                    </p>
                    <p className="truncate font-mono text-xs font-light text-white/70">
                      <span>{photo.location}</span>
                      <span className="mx-1">·</span>
                      <span>{formatDay(new Date(photo.date))}</span>
                    </p>
                  </div>
                </PhotoImage>
              </Link>
            );
          })}
        </div>
      </div>
    </BasicLayout>
  );
}
