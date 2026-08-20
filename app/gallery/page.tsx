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
        {/* Tile height comes from the tile's own aspect ratio, not a fixed row
          track. A constant track height only matches the photo at one viewport
          width — everywhere else the column has grown or shrunk underneath it,
          and at two columns on a ~600px screen that turned every portrait into
          a landscape crop. Declaring the real ratio instead lets the row track
          follow the column.

          Rows still line up: a mixed row takes the tallest tile's height and
          `stretch` pulls the rest to match, which `object-cover` absorbs. At two
          columns the rows are uniform by construction — a pair of verticals, or
          one full-width horizontal — so those tiles are shown uncropped.

          `dense` backfills the holes. A vertical followed by a horizontal can't
          share a two-column row, so the horizontal wrapped and left the cell
          beside the vertical empty; dense pulls a later single-column tile up
          into it. It's a no-op at four columns, where the set already packs. */}
        <div className="grid grid-flow-row-dense grid-cols-2 gap-3 sm:grid-cols-4">
          {sortedPhotos.map((photo, index) => {
            const wide = photo.orientation === "horizontal";
            return (
              <Link
                key={photo.slug}
                href={photo.url}
                className={cn(
                  "group relative",
                  // Only the vertical tile declares a ratio, and that is what
                  // sizes the row. A grid item with an aspect ratio ignores
                  // `stretch` on whichever axis is auto — give the wide tile
                  // `aspect-[3/2]` too and it holds a shorter height than the
                  // row (ragged bottom edge); pin its height instead and the
                  // ratio drives the width, overflowing the span. With no ratio
                  // it stretches on both axes and `object-cover` takes the
                  // difference. Alone in a row — every horizontal at two
                  // columns — nothing sets a height, so it falls back to the
                  // photo's own 3:2.
                  wide ? "col-span-2" : "aspect-[2/3]",
                )}
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
                      "pointer-events-none absolute inset-x-0 bottom-0 p-3 pt-10",
                      // A two-stop ramp is already down to ~40% black where the
                      // title sits, which loses white text against a bright sky
                      // or a sunlit slope. Extra stops hold the scrim dark
                      // through both caption lines and only then fall away.
                      "bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.65)_35%,rgba(0,0,0,0.25)_70%,transparent_100%)]",
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
                    {/* The shadow is the second line of defence: it rides along
                      with the glyphs, so it still separates them from whatever
                      detail the scrim alone doesn't flatten. */}
                    <p className="truncate font-cal text-sm text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                      {photo.title}
                    </p>
                    <p className="truncate font-mono text-xs font-light text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
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
