import { allCrafts } from "@/.content-collections/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { Github } from "lucide-react";
import { Link } from "@/components/mdx/link";
import { formatMonth } from "@/lib/formats";

export default async function CraftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = allCrafts.find((c) => c.slug === slug);

  if (!post) notFound();

  return (
    <article>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-cal text-lg text-foreground">{post.title}</p>
          <p className="font-mono text-xs font-light text-muted-foreground">
            {formatMonth(new Date(post.date))} &#x22C5; {post.readingTime}
          </p>
        </div>
        <div className="flex gap-2">
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
