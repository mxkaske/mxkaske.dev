import { allPosts } from "@/.contentlayer/generated";
import { Footer } from "@/app/components/footer";

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
      // Could also include `publishTime` and `author` - see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph
    },
    // https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
    // disabling viewport zoom is a bad practice
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
    <main className="container mx-auto flex min-h-screen max-w-[calc(65ch+100px)] flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <div className="flex flex-1 flex-col rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        {children}
      </div>
      <Footer />
    </main>
  );
}
