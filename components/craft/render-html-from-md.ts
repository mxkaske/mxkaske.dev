import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeParse from "rehype-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeRewrite from "rehype-rewrite";
import { visit } from "unist-util-visit";
import { Node, Parent } from "unist";

const people = ["@mxkaske", "@shadcn"];

function transformTextNode(tree: Node) {
  visit(tree, "text", (node: Text, index, parent) => {
    const words = node.value.split(/(?=@\w+)/);

    const transformedWords = words.map((word: string) => {
      if (word.startsWith("@")) {
        return {
          type: "element",
          tagName: "span",
          properties: {},
          children: [{ type: "text", value: word }],
        };
      } else {
        return { type: "text", value: word };
      }
    });

    parent.children.splice(index, 1, ...transformedWords);
  });
}

export const test = () => {
  const markdownText =
    "Hello, this is a text _node_ containing @mxkaske or more.";
  const tree = unified().use(rehypeParse).parse(markdownText);

  transformTextNode(tree);

  const transformedHTML = unified().use(rehypeStringify).stringify(tree);

  console.log(transformedHTML);
};

const processor = unified()
  .use(remarkParse)
  // .use(customPlugin)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify);

export function renderHTML(md: string) {
  // console.log(md);
  return processor.processSync(md).toString();
}
