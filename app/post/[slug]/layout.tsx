import React from "react";
import { allPosts } from "@/.contentlayer/generated";

export async function generateStaticParams() {
  return allPosts.map((c) => ({ slug: c.url }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find((c) => c.url === `/post/${params.slug}`);
  return {
    title: post?.title,
    description: post?.description,
    twitter: {
      images: [
        `${process.env.VERCEL_URL}/api/og?title=${post?.title}&description=${post?.description}`,
      ],
      card: "summary_large_image",
      title: post?.title,
      description: post?.description,
    },
    openGraph: {
      type: "website",
      images: [
        `${process.env.VERCEL_URL}/api/og?title=${post?.title}&description=${post?.description}`,
      ],
      title: post?.title,
      description: post?.description,
      url: `http://craft.mxkaske.dev/posts/${post?.slug}`,
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
