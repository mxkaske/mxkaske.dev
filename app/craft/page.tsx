import React from "react";
import { type Craft, allCrafts } from "@/.content-collections/generated";
import { components } from "@/lib/mdx";
import { Thumbnail } from "./_components/thumbnail";
import { Metadata } from "next";
import { BasicLayout } from "../_components/basic-layout";

const TITLE = "craft.mxkaske.dev";
const DESCRIPTION = "Never. Stop. Crafting.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://craft.mxkaske.dev"),
  twitter: {
    images: [`/api/og?title=${TITLE}&description=${DESCRIPTION}`],
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  openGraph: {
    type: "website",
    images: [`/api/og?title=${TITLE}&description=${DESCRIPTION}`],
    title: TITLE,
    description: DESCRIPTION,
  },
};

const allCraftsByMonth = allCrafts.reduce(
  (acc, curr) => {
    const month = new Date(curr.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (acc.hasOwnProperty(month)) {
      acc[month].push(curr);
    } else {
      acc[month] = [curr];
    }

    return acc;
  },
  {} as { [month: string]: Craft[] }
);

export default function Page() {
  return (
    <BasicLayout>
      <div className="space-y-8">
        <h1 className="font-cal text-3xl text-foreground">
          Never. Stop. Crafting.
        </h1>
        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
          {Object.keys(allCraftsByMonth)
            .sort((a, b) =>
              new Date(a).getTime() > new Date(b).getTime() ? -1 : 1
            )
            .map((month) => {
              return (
                <React.Fragment key={month}>
                  <div>
                    <p className="font-mono text-sm font-light text-muted-foreground">
                      {month}
                    </p>
                  </div>
                  <div className="grid gap-6 sm:gap-4">
                    {allCraftsByMonth[month]
                      .sort((a, b) => (a.date > b.date ? -1 : 1))
                      .map((post) => {
                        const Component =
                          components[post.component as keyof typeof components];
                        return (
                          <Thumbnail
                            key={post.slug}
                            url={post.url}
                            title={post.title}
                            description={post.description}
                            component={<Component />}
                            componentClassName={post.componentClassName}
                          />
                        );
                      })}
                  </div>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </BasicLayout>
  );
}
