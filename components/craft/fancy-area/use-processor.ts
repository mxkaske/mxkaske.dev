import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { createElement, useEffect, useState } from "react";
import { Mention } from "./mention";

export function useProcessor(md: string) {
  const [content, setContent] = useState<React.ReactNode>(null);
  console.log(md);
  const mentionRegex = /@(\w+)/g;
  const text = md.replace(mentionRegex, '<mention handle="$1">@$1</mention>');

  console.log(text);

  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, {
        ...defaultSchema,
        tagNames: [...defaultSchema.tagNames!, "mention"],
        attributes: {
          ...defaultSchema.attributes,
          mention: ["handle"],
        },
      })
      // @ts-expect-error because mention is not valid html-tag
      .use(rehypeReact, {
        createElement,
        components: {
          mention: Mention,
        },
      })
      .process(text)
      .then((file) => {
        setContent(file.result);
      });
  }, [text]);

  return content;
}
