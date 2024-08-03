"use client";

import { cn } from "@/lib/utils";
import { REGIONS, TAGS, type ColumnSchema } from "./schema";
import type { DataTableFilterField, Option } from "./types";

export const tagsColor = {
  api: {
    badge:
      "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10",
    dot: "bg-[#10b981]",
  },
  web: {
    badge:
      "text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10",
    dot: "bg-[#0ea5e9]",
  },
  enterprise: {
    badge:
      "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10",
    dot: "bg-[#ec4899]",
  },
  app: {
    badge:
      "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10",
    dot: "bg-[#f97316]",
  },
} as Record<string, Record<"badge" | "dot", string>>;

export const data = [
  {
    name: "Edge Api",
    url: "edge-api.acme.com/health",
    p95: 140,
    public: true,
    active: true,
    regions: ["ams", "gru", "syd"],
    tags: ["api", "enterprise"],
  },
  {
    name: "Lambda Api",
    url: "lambda-api.acme.com/health",
    p95: 203,
    public: true,
    active: true,
    regions: ["ams", "gru", "syd"],
    tags: ["api"],
  },
  {
    name: "Storybook",
    url: "storybook.acme.com",
    p95: 1252,
    public: false,
    active: true,
    regions: ["iad"],
    tags: ["web"],
  },
  {
    name: "Marketing",
    url: "acme.com",
    p95: 659,
    public: true,
    active: true,
    regions: ["hkg", "fra", "iad"],
    tags: ["web"],
  },
  {
    name: "App",
    url: "app.acme.com",
    p95: 1301,
    public: false,
    active: true,
    regions: ["iad", "fra"],
    tags: ["app"],
  },
  {
    name: "Demo",
    url: "demo.acme.com",
    p95: 2420,
    public: true,
    active: true,
    regions: ["iad"],
    tags: ["web", "enterprise"],
  },
  {
    name: "Documentation",
    url: "docs.acme.com",
    p95: 943,
    public: true,
    active: true,
    regions: ["ams"],
    tags: ["api", "web"],
  },
  {
    name: "Boilerplate",
    url: "boilerplate.acme.com",
    p95: undefined,
    public: true,
    active: false,
    regions: ["gru", "fra"],
    tags: ["web"],
  },
  {
    name: "Dashboard",
    url: "app.acme.com/dashboard",
    p95: 967,
    public: false,
    active: true,
    regions: ["iad", "fra"],
    tags: ["web"],
  },
  {
    name: "E2E Testing",
    url: "staging-cypress-e2e.acme.com",
    p95: 1954,
    public: false,
    active: true,
    regions: ["iad"],
    tags: ["web"],
  },
  {
    name: "Web App",
    url: "web-app.acme.com",
    p95: 1043,
    public: true,
    active: true,
    regions: ["iad"],
    tags: ["web"],
  },
] satisfies ColumnSchema[];

export const filterFields = [
  {
    label: "URL",
    value: "url",
    type: "input",
    options: data.map(({ url }) => ({ label: url, value: url })),
  },
  {
    label: "Public",
    value: "public",
    type: "checkbox",
    options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
  },
  {
    label: "Active",
    value: "active",
    type: "checkbox",
    options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
  },
  {
    label: "P95",
    value: "p95",
    type: "slider",
    min: 0,
    max: 3000,
    options: data.map(({ p95 }) => ({ label: `${p95}`, value: 95 })),
  },
  {
    label: "Regions",
    value: "regions",
    type: "checkbox",
    options: REGIONS.map((region) => ({ label: region, value: region })),
  },
  {
    label: "Tags",
    value: "tags",
    type: "checkbox",
    // REMINDER: "use client" needs to be declared in the file - otherwise getting serialization error from Server Component
    component: (props: Option) => {
      if (typeof props.value === "boolean") return null;
      return (
        <div className="flex w-full items-center justify-between gap-2">
          <span className="truncate font-normal">{props.value}</span>
          <span
            className={cn("h-2 w-2 rounded-full", tagsColor[props.value].dot)}
          />
        </div>
      );
    },
    options: TAGS.map((tag) => ({ label: tag, value: tag })),
  },
] satisfies DataTableFilterField<ColumnSchema>[];
