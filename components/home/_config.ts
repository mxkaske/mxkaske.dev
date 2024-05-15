import { Github, Icon, Mail, Twitter } from "lucide-react";

export type Content = {
  name: string;
  description?: string;
  link: {
    href: string;
    label: string;
  };
};

export type ContentWithDate = Content & { date: Date };
export type ContentWithIcon = Content & { icon: Icon };

// type Contact = {
//   name: string;
//   link: { href: string; label: string };
//   icon: Icon;
// };

export const projects = [
  {
    name: "OpenStatus",
    description:
      "A simple, open-source monitoring system with incident management.",
    link: {
      href: "https://openstatus.dev",
      label: "openstatus.dev",
    },
    date: new Date("2023-06-01"),
  },
  {
    name: "Craft",
    description:
      "My private crafting corner, building components with React and Shadcn UI.",
    link: {
      href: "https://craft.mxkaske.dev",
      label: "craft.mxkaske.dev",
    },
    date: new Date("2023-05-01"),
  },
  {
    name: "TimeInput",
    description:
      "A time component for React, built with Tailwind CSS and Shadcn UI. Without dependencies.",
    link: {
      href: "https://time.openstatus.dev",
      label: "time.openstatus.dev",
    },
    date: new Date("2023-11-01"),
  },
  {
    name: "Precycle",
    description: "Building a plastic credit system.",
    link: {
      href: "https://precycle.today",
      label: "precycle.today",
    },
    date: new Date("2021-07-01"),
  },
  {
    name: "Leila",
    description: "Knowledge for everyday clinical practice - a Guideline App.",
    link: {
      href: "https://leila.de",
      label: "leila.de",
    },
    date: new Date("2019-10-01"),
  },
  {
    name: "Evnt",
    description: "A simple event sourcing playground.",
    link: {
      href: "https://evnt-sh.vercel.app",
      label: "evnt.sh",
    },
    date: new Date("2023-06-01"),
  },
  {
    name: "Featured Upstash Post",
    description: "Post most popular NY Times articles to Discord with QStash",
    link: {
      href: "https://upstash.com/blog/schedule-news",
      label: "upstash.com/blog/schedule-news",
    },
    date: new Date("2022-11-23"),
  },
  {
    name: "Writing",
    description: "Some of my old articles.",
    link: {
      href: "https://v2.mxkaske.dev/writing",
      label: "v2.mxkaske.dev/writing",
    },
    date: new Date("2022-10-26"),
  },
] satisfies ContentWithDate[];

export const contacts = [
  {
    name: "Twitter",
    link: {
      href: "https://twitter.com/mxkaske",
      label: "@mxkaske",
    },
    icon: Twitter,
  },
  {
    name: "GitHub",
    link: {
      href: "https://github.com/mxkaske",
      label: "@mxkaske",
    },
    icon: Github,
  },
  {
    name: "Email",
    link: {
      href: "mailto:dev@mxkaske.dev",
      label: "dev@mxkaske.dev",
    }, // TODO: add gmail
    icon: Mail,
  },
] satisfies ContentWithIcon[];
