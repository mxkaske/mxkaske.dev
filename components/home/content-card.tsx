"use client";

import { ContentWithDate, ContentWithIcon } from "@/components/home/_config";
import { SpotlightCard } from "@/components/home/spotlight-card";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight } from "lucide-react";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

type ContentCard = (ContentWithDate | ContentWithIcon) & {
  className?: string;
};

function isDateInProps(
  props: ContentWithDate | ContentWithIcon
): props is ContentWithDate {
  return (props as ContentWithDate).date !== undefined;
}

function isIconInProps(
  props: ContentWithDate | ContentWithIcon
): props is ContentWithIcon {
  return (props as ContentWithIcon).icon !== undefined;
}

export function ContentCard({ className, ...props }: ContentCard) {
  return (
    <div
      className={cn(
        "group/card flex flex-col rounded-lg border border-border/80 bg-card text-card-foreground shadow-sm hover:border-border",
        className
      )}
    >
      <SpotlightCard className="flex h-full w-full flex-col">
        <div className="flex flex-col gap-1.5 p-4">
          <p className="font-mono text-sm text-muted-foreground">
            {isDateInProps(props) ? formatter.format(props.date) : null}
            {isIconInProps(props) && props.icon ? (
              <props.icon className="my-0.5 h-4 w-4" />
            ) : null}
          </p>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {props.name}
          </h3>
          <p className="text-sm text-muted-foreground">{props?.description}</p>
        </div>
        <div className="flex flex-1 items-end p-4 pt-0">
          <a
            href={props.link.href}
            target="_blank"
            className="group/link relative w-fit text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            {props.link.label}{" "}
            <ArrowRight className="relative inline h-4 w-0 transition-all group-hover/link:w-4" />
            <ChevronRight className="invisible relative inline h-4 w-4 text-muted-foreground transition-all group-hover/card:visible group-hover/link:w-0" />
          </a>
        </div>
      </SpotlightCard>
    </div>
  );
}
