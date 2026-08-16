import { allBrews } from "@/.content-collections/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { formatDay } from "@/lib/formats";
import type { Metadata } from "next";
import { PaginationFooter } from "@/components/content/pagination-footer";
import {
  PageHeader,
  PageHeaderMeta,
  PageHeaderTitle,
} from "@/components/content/page-header";
import { ViewsNumber } from "@/components/content/views-number";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allBrews.find((c) => c.slug === slug);
  return {
    metadataBase: new URL("https://brew.mxkaske.dev"),
    title: post?.title,
    description: post?.description,
    twitter: {
      images: [`/api/og?title=${post?.title}&description=${post?.description}`],
      card: "summary_large_image",
      title: post?.title,
      description: post?.description,
    },
    openGraph: {
      type: "website",
      images: [`/api/og?title=${post?.title}&description=${post?.description}`],
      title: post?.title,
      description: post?.description,
      url: `/posts/${post?.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return allBrews.map((post) => ({ slug: post.slug }));
}

const sortedBrews = allBrews.sort((a, b) =>
  a.date.getTime() > b.date.getTime() ? -1 : 1,
);

export default async function BrewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const postIndex = sortedBrews.findIndex((c) => c.slug === slug);
  const post = sortedBrews[postIndex];

  if (!post) notFound();

  const prev = sortedBrews[postIndex - 1];
  const next = sortedBrews[postIndex + 1];

  return (
    <article className="space-y-8">
      <PageHeader>
        <PageHeaderTitle>{post.title}</PageHeaderTitle>
        <PageHeaderMeta>
          <span>{formatDay(new Date(post.date))}</span>
          <span>{post.readingTime}</span>
          <ViewsNumber />
        </PageHeaderMeta>
      </PageHeader>
      <Content post={post} />
      <Separator className="my-8" />
      <PaginationFooter prev={prev} next={next} />
    </article>
  );
}
