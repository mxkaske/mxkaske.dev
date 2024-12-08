import { allCrafts } from "@/.content-collections/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { Github } from "lucide-react";
import { formatMonth } from "@/lib/formats";
import { PaginationFooter } from "@/components/content/pagination-footer";
import { Button } from "@/components/ui/button";
import { ViewsNumber } from "@/components/content/views-number";

const sortedCrafts = allCrafts.sort((a, b) =>
  a.date.getTime() > b.date.getTime() ? -1 : 1
);

export default async function CraftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const postIndex = sortedCrafts.findIndex((c) => c.slug === slug);
  const post = sortedCrafts[postIndex];

  if (!post) notFound();

  const prev = sortedCrafts[postIndex - 1];
  const next = sortedCrafts[postIndex + 1];

  return (
    <article>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-cal text-lg text-foreground">{post.title}</p>
          <div className="flex flex-wrap font-mono text-xs font-light text-muted-foreground">
            <span>{formatMonth(new Date(post.date))}</span>
            <span className="mx-1">·</span>
            <span>{post.readingTime}</span>
            <span className="mx-1">·</span>
            <ViewsNumber />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <a href={post.githubUrl} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      <Content post={post} />
      <PaginationFooter prev={prev} next={next} className="mt-8" />
    </article>
  );
}
