"use client";

import { useProcessor } from "./use-processor";

interface Props {
  textValue: string;
}

export function Preview({ textValue }: Props) {
  const Component = useProcessor(textValue);
  return <div
    className="w-full overflow-auto prose dark:prose-invert prose-sm h-[159.5px] px-1 border border-transparent prose-headings:font-cal"
  >
    {Component}
  </div>
}