import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeReact from 'rehype-react';
import rehypeSanitize, {defaultSchema} from 'rehype-sanitize';
import { createElement, Fragment, useEffect, useState } from 'react'
import { Mention } from "./mention";

export function useProcessor(md: string) {
  const [content, setContent] = useState<React.ReactNode>(null)

  const mentionRegex = /@(\w+)/g;
  const text = md.replace(mentionRegex, '<mention>@$1</mention>');

  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, {...defaultSchema, 
      tagNames: [...defaultSchema.tagNames!, "mention"] })
      // @ts-expect-error
      .use(rehypeReact, {
        createElement,
        components: {
          mention: Mention
        }
      })
      .process(text)
      .then((file) => {
        setContent(file.result)
      })
  }, [text])

  return content || Fragment
}