"use client";

import { useProcessor } from "./use-processor";

interface Props {
  textValue: string;
}

export function Preview({ textValue }: Props) {
  const Component = useProcessor(textValue);
  return <div
    className="w-[352px] h-[140px] overflow-auto prose dark:prose-invert"
  >
    {/* @ts-ignore */}
    {Component}
  </div>
}