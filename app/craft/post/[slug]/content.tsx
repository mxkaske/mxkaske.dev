"use client";

import React from "react";
import { Craft } from "@/.content-collections/generated";
import { components } from "@/lib/mdx";
import { MDXContent } from "@content-collections/mdx/react";

export function Content({ post }: { post: Craft }) {
  React.useEffect(() => {
    fetch(`/api/views?slug=${post.slug}`, { method: "POST" });
  }, [post.slug]);

  return (
    <div className="prose mx-auto dark:prose-invert prose-headings:font-cal prose-headings:font-normal prose-blockquote:font-light prose-figure:border prose-figure:bg-background prose-figure:rounded-lg">
      <MDXContent components={components} code={post.mdx} />
    </div>
  );
}
