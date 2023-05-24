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
    <main className="mx-auto container max-w-prose min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
      <div className="backdrop-blur-[2px] flex-1 flex flex-col rounded-lg bg-background/50 p-4 md:p-8">
        {children}
      </div>
    </main>
  );
}
