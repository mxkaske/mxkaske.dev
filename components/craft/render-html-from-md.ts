import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";

const processor = unified()
  .use(remarkParse)
  // .use(customPlugin)
  .use(remarkRehype)
  // .use(rehypeRaw)
  .use(rehypeStringify);

export function renderHTML(md: string) {
  // console.log(md);
  return processor.processSync(md).toString();
}
