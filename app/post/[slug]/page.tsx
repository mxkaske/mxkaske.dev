import { allPosts } from "@/.contentlayer/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { Github } from "lucide-react";
import { Link } from "@/components/mdx/link";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

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

  const views =
    (await redis.get<number>(["pageviews", "posts", post.slug].join(":"))) ?? 0;

  return (
    <article className="max-w-prose mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-foreground font-cal font-bold text-lg">
            {post.title}
          </p>
          <p className="text-muted-foreground text-sm font-light">
            {formatDate(new Date(post.date))}
          </p>
        </div>
        <a
          href={post.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 text-foreground bg-background rounded-md hover:bg-muted"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
      <Content post={post} />
      <div className="mt-8 flex justify-between items-center">
        <div>
          <Link href="/">Back</Link>
        </div>
        <div>
          <p className="text-muted-foreground font-mono text-sm tracking-tighter">
            {formatNumber(views)} views
          </p>
        </div>
      </div>
    </article>
  );
}
