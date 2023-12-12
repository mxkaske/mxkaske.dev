import { allPosts } from "@/.contentlayer/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { ChevronLeft, Github, Link as LinkIcon } from "lucide-react";
import { Link } from "@/components/mdx/link";

const URL =
  process.env.VERCEL_ENV === "production"
    ? `https://craft.mxkaske/dev`
    : process.env.VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_URL;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find((c) => c.url === `/craft/${params.slug}`);
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
      url: `/craft/${post?.slug}`,
      // Could also include `publishTime` and `author` - see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph
    },
    // https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
    // disabling viewport zoom is a bad practice
  };
}

export default async function CraftPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((c) => c.url === `/craft/${params.slug}`);
  if (!post) {
    notFound();
  }

  // const res = await fetch(`${URL}/api/views?slug=${post.slug}`, {
  //   next: { revalidate: 10 },
  // });
  // const views = await res.json();

  return (
    <article className="mx-auto max-w-prose">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold text-foreground">{post.title}</p>
          <p className="font-mono text-xs font-light text-muted-foreground">
            {formatDate(new Date(post.date))} &#x22C5; {post.readingTime}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button
            className="p-2 text-foreground bg-background rounded-md hover:bg-muted"
          >
            <LinkIcon className="h-5 w-5" />
          </button> */}
          <a
            href={post.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-background p-2 text-foreground hover:bg-muted"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
      <Content post={post} />
      <div className="mt-8 flex items-center justify-between">
        <div>
          <Link href="/craft">Back</Link>
        </div>
        <div>
          {/* <p className="text-muted-foreground font-mono text-sm tracking-tighter">
            {formatNumber(views)} views
          </p> */}
        </div>
      </div>
    </article>
  );
}
