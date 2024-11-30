import { allCrafts } from "@/.content-collections/generated";
import { BasicLayout } from "@/app/_components/basic-layout";
import { Footer } from "@/app/_components/footer";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allCrafts.find((c) => c.slug === slug);
  return {
    metadataBase: new URL("https://craft.mxkaske.dev"),
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
  return allCrafts.map((post) => ({ slug: post.slug }));
}

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BasicLayout>{children}</BasicLayout>;
}
