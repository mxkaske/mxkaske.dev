import { allPosts } from "@/.contentlayer/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { Github, Link as LinkIcon } from "lucide-react";
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

export default async function CraftPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((c) => c.url === `/post/${params.slug}`);
  if (!post) {
    notFound();
  }

  // const res = await fetch(`${URL}/api/views?slug=${post.slug}`, {
  //   next: { revalidate: 10 },
  // });
  // const views = await res.json();

  return (
    <article>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-foreground font-cal font-bold text-lg">
            {post.title}
          </p>
          <p className="text-muted-foreground text-xs font-light font-mono">
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
            className="p-2 text-foreground bg-background rounded-md hover:bg-muted"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
      <Content post={post} />
      <div className="mt-8 flex justify-between items-center">
        <div>
          <Link href="/">Back</Link>
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
