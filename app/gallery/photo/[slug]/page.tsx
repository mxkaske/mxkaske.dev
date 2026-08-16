import { allPhotos } from "@/.content-collections/generated";
import { BasicLayout } from "@/app/_components/basic-layout";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderMeta,
  PageHeaderTitle,
} from "@/components/content/page-header";
import { PaginationFooter } from "@/components/content/pagination-footer";
import { ViewsNumber } from "@/components/content/views-number";
import { PhotoImage } from "@/components/gallery/photo-image";
import { Button } from "@/components/ui/button";
import { formatDay, formatMonth } from "@/lib/formats";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { Content } from "./content";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const photo = allPhotos.find((p) => p.slug === slug);
  const og = `/api/og/gallery?slug=${slug}`;
  const description = photo ? `${photo.location} · ${photo.camera}` : undefined;

  return {
    metadataBase: new URL("https://gallery.mxkaske.dev"),
    title: photo?.title,
    description,
    twitter: {
      images: [og],
      card: "summary_large_image",
      title: photo?.title,
      description,
    },
    openGraph: {
      type: "article",
      images: [og],
      title: photo?.title,
      description,
      url: photo?.url,
    },
  };
}

export async function generateStaticParams() {
  return allPhotos.map((photo) => ({ slug: photo.slug }));
}

const sortedPhotos = [...allPhotos].sort((a, b) =>
  a.date.getTime() > b.date.getTime() ? -1 : 1,
);

/**
 * Every photo is capped at the height a 3:2 landscape reaches across the full
 * content width. Landscapes are unaffected; a portrait narrows to hold that
 * height rather than running a page and a half down the screen.
 */
const LANDSCAPE_RATIO = 3 / 2;

/**
 * Rounded up from what `max-w-[calc(65ch+100px)]` less its padding actually
 * measures. Only feeds `sizes`, where guessing high costs a few bytes and
 * guessing low costs sharpness.
 */
const CONTENT_WIDTH = 640;

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const photoIndex = sortedPhotos.findIndex((p) => p.slug === slug);
  const photo = sortedPhotos[photoIndex];

  if (!photo) notFound();

  const prev = sortedPhotos[photoIndex - 1];
  const next = sortedPhotos[photoIndex + 1];

  // The cap has to be expressed as a width, since the frame keeps the photo's
  // own aspect ratio — and as a share of the container, so it holds at every
  // breakpoint without hard-coding the content width.
  const widthShare = (photo.width / photo.height / LANDSCAPE_RATIO) * 100;

  return (
    <BasicLayout>
      <article className="space-y-8">
        <PageHeader>
          <PageHeaderTitle>{photo.title}</PageHeaderTitle>
          <PageHeaderMeta>
            <span>{formatMonth(new Date(photo.date))}</span>
            <span>{photo.readingTime}</span>
            <ViewsNumber />
          </PageHeaderMeta>
          <PageHeaderActions>
            <Button variant="ghost" size="icon" asChild>
              {/* Same-origin, so `download` names the file the visitor gets
                  instead of navigating them to the raw asset. */}
              <a
                href={photo.image}
                download={photo.image.split("/").pop()}
                aria-label={`Download ${photo.title}`}
              >
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </PageHeaderActions>
        </PageHeader>
        <div
          className="mx-auto w-full"
          style={{ maxWidth: `${widthShare.toFixed(2)}%` }}
        >
          <PhotoImage
            photo={photo}
            mode="resolve"
            priority
            sizes={`(min-width: 920px) ${Math.round((CONTENT_WIDTH * widthShare) / 100)}px, ${Math.round(widthShare)}vw`}
          />
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-mono [&_dt]:text-muted-foreground [&_dt]:uppercase [&_dt]:text-xs [&_dd]:text-foreground">
          <div>
            <dt>Date</dt>
            <dd>{formatDay(new Date(photo.date))}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{photo.location}</dd>
          </div>
          <div>
            <dt>Camera</dt>
            <dd>{photo.camera}</dd>
          </div>
        </dl>
        <Content photo={photo} />
        <Separator />
        <PaginationFooter prev={prev} next={next} />
      </article>
    </BasicLayout>
  );
}
