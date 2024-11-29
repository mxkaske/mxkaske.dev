"use client";

import React from "react";
import { Post } from "@/.content-collections/generated";
import { components } from "@/lib/mdx";
import { MDXContent } from "@content-collections/mdx/react";

export function Content({ post }: { post: Post }) {
  React.useEffect(() => {
    fetch(`/api/views?slug=${post.slug}`, { method: "POST" });
  }, [post.slug]);

  return (
    <div className="prose mx-auto dark:prose-invert prose-headings:font-cal prose-blockquote:font-light">
      <MDXContent components={components} code={post.mdx} />
    </div>
  );
}
