import { allCrafts } from "@/.content-collections/generated";
import { notFound } from "next/navigation";
import { Content } from "./content";
import { Github } from "lucide-react";
import { formatMonth } from "@/lib/formats";
import { PaginationFooter } from "@/components/content/pagination-footer";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderMeta,
  PageHeaderTitle,
} from "@/components/content/page-header";
import { Button } from "@/components/ui/button";
import { ViewsNumber } from "@/components/content/views-number";
import { Separator } from "@/components/ui/separator";

const sortedCrafts = allCrafts.sort((a, b) =>
  a.date.getTime() > b.date.getTime() ? -1 : 1,
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
      <PageHeader>
        <PageHeaderTitle>{post.title}</PageHeaderTitle>
        <PageHeaderMeta>
          <span>{formatMonth(new Date(post.date))}</span>
          <span>{post.readingTime}</span>
          <ViewsNumber />
        </PageHeaderMeta>
        <PageHeaderActions>
          <Button variant="ghost" size="icon" asChild>
            <a href={post.githubUrl} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </PageHeaderActions>
      </PageHeader>
      <Content post={post} />
      <Separator className="my-8" />
      <PaginationFooter prev={prev} next={next} />
    </article>
  );
}
