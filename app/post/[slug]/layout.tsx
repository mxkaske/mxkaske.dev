import React from "react";
import { allPosts } from "@/.contentlayer/generated";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find((c) => c.url === `/post/${params.slug}`);
  return {
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
      // Could alsop include `publishTime` and `author` - see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
  };
}

export default function BaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) {
  return (
    // if bgblur, add backdrop-blur-[2px]
    <main className="container py-16 min-h-screen">{children}</main>
  );
}
