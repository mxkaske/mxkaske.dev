"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Icon, Linkedin, Mail, Twitter } from "lucide-react";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { Link } from "@/components/mdx/link";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-4 px-2 py-4 md:px-4 md:py-8">
      <Header />
      <main className="flex flex-1 flex-col gap-8 rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] sm:p-8">
        <div className="grid gap-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Building. Learning. Sharing.
          </h2>
          {/* Follow me. */}
          <h3 className="text-lg font-light text-muted-foreground">
            Just call me Max.{" "}
            <Link href="https://twitter.com/mxkaske">Follow me</Link> for more
            updates.
          </h3>
        </div>
        {/* https://caniuse.com/mdn-css_properties_grid-template-rows_masonry */}
        <div className="grid grid-flow-dense grid-cols-1 grid-rows-[masonry] gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, i) => (
            <Card
              key={i}
              className="flex flex-col first:sm:col-span-2 first:xl:col-start-2"
            >
              <CardHeader>
                <p className="text-sm font-light text-muted-foreground">
                  {formatter.format(project.date)}
                </p>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 items-end">
                <Button className="px-0 py-0" variant="link" asChild>
                  <a href={project.url} target="_blank">
                    {project.url}
                  </a>
                </Button>
              </CardContent>
              <CardFooter>
                <Badge variant="outline">{project.type}</Badge>
              </CardFooter>
            </Card>
          ))}
          {contacts.map((contact, i) => {
            const Icon = contact.icon;
            return (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{contact.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Icon className="h-6 w-6" />
                  <Button className="px-0 py-0" variant="link" asChild>
                    <a href={contact.url} target="_blank">
                      {contact.handle}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

type Project = {
  name: string;
  description: string;
  url: string;
  type: "private" | "work";
  date: Date;
};

const projects = [
  {
    name: "OpenStatus",
    description:
      "A simple, open-source monitoring system with incident management.",
    url: "https://openstatus.dev",
    date: new Date("2023-06-01"),
    type: "private",
  },
  {
    name: "Craft",
    description:
      "My private crafting corner, building components with React and Shadcn UI.",
    url: "https://craft.mxkaske.dev",
    date: new Date("2023-05-01"),
    type: "private",
  },
  {
    name: "InputTime",
    description:
      "A time component for React, built with Tailwind CSS and Shadcn UI. Without dependencies.",
    url: "https://time.openstatus.dev",
    date: new Date("2023-11-01"),
    type: "private",
  },
  {
    name: "Precycle",
    description: "Building a plastic credit system.",
    url: "https://precycle.today",
    date: new Date("2021-07-01"),
    type: "work",
  },
  {
    name: "Leila",
    description: "Knowledge for everyday clinical practice - a Guideline App.",
    url: "https://leila.de",
    date: new Date("2019-10-01"),
    type: "work",
  },
  {
    name: "Evnt",
    description: "A simple event sourcing playground.",
    url: "https://evnt.sh",
    date: new Date("2023-06-01"),
    type: "private",
  },
  {
    name: "Featured Upstash Post",
    description: "Post most popular NY Times articles to Discord with QStash",
    url: "https://upstash.com/blog/schedule-news",
    date: new Date("2022-11-23"),
    type: "private",
  },
  {
    name: "Writing",
    description: "Some of my old articles.",
    url: "https://v2.mxkaske.dev/writing",
    date: new Date("2022-10-26"),
    type: "private",
  },
  // CV
] satisfies Project[];

type Contact = {
  name: string;
  url: string;
  handle: string;
  icon: Icon;
};

const contacts = [
  {
    name: "Twitter",
    handle: "@mxkaske",
    url: "https://twitter.com/mxkaske",
    icon: Twitter,
  },
  {
    name: "GitHub",
    handle: "mxkaske",
    url: "https://github.com/mxkaske",
    icon: Github,
  },
  // {
  //   name: "LinkedIn",
  //   url: "https://www.linkedin.com/in/mxkaske/",
  //   icon: Linkedin,
  // },
  {
    name: "Email",
    handle: "dev@mxkaske.dev",
    url: "mailto:dev@mxkaske.dev", // TODO: add gmail
    icon: Mail,
  },
] satisfies Contact[];
