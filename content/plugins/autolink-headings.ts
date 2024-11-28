import rehypeAutolinkHeadings from "rehype-autolink-headings";

const autolinkHeadings = [
  rehypeAutolinkHeadings,
  {
    behavior: "append",
    properties: {
      className: [
        // FIXME: seems like its not displayed
        "no-underline after:content-['#'] ml-1 after:text-gray-200 hover:after:text-gray-500 hover:after:bg-gray-50 after:rounded-md after:p-1",
      ],
    },
  },
];

export default autolinkHeadings;