"use client";

import { cn } from "@/lib/utils";
import type { Schema } from "./schema";
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
      "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20 hover:bg-[#eab308]/10",
    dot: "bg-[#eab308]",
  },
} as Record<string, Record<"badge" | "dot", string>>;

export const data = [
  {
    name: "Edge Api",
    p95: 140,
    public: true,
    active: true,
    regions: ["ams", "gru", "syd"],
    tags: ["api", "enterprise"],
  },
  {
    name: "Lambda Api",
    p95: 203,
    public: true,
    active: true,
    regions: ["ams", "gru", "syd"],
    tags: ["api"],
  },
  {
    name: "OpenStatus",
    p95: 891,
    public: false,
    active: false,
    regions: ["iad", "fra"],
    tags: ["enterprise"],
  },
  {
    name: "Storybook",
    p95: 1252,
    public: false,
    active: true,
    regions: ["iad"],
    tags: ["web"],
  },
  {
    name: "Marketing Site",
    p95: 659,
    public: true,
    active: true,
    regions: ["hkg", "fra", "iad"],
    tags: ["web"],
  },
  {
    name: "App",
    p95: 1301,
    public: false,
    active: true,
    regions: ["iad", "fra"],
    tags: ["app"],
  },
  {
    name: "Demo",
    p95: 2420,
    public: true,
    active: true,
    regions: ["iad"],
    tags: ["web"],
  },
  {
    name: "Documentation",
    p95: 943,
    public: true,
    active: true,
    regions: ["ams"],
    tags: ["api", "web"],
  },
  {
    name: "Boilerplate",
    p95: 1569,
    public: true,
    active: false,
    regions: ["gru", "fra"],
    tags: ["web"],
  },
  {
    name: "Dashboard",
    p95: 967,
    public: false,
    active: true,
    regions: ["iad", "fra"],
    tags: ["web"],
  },
  {
    name: "E2E Testing",
    p95: 1954,
    public: false,
    active: true,
    regions: ["iad"],
    tags: ["web"],
  },
  {
    name: "Web App",
    p95: 1043,
    public: true,
    active: true,
    regions: ["iad"],
    tags: ["web"],
  },
] satisfies Schema[];

export const filterFields = [
  {
    label: "Public",
    value: "public",
    type: "checkbox",
    options: [
      { label: "true", value: true },
      { label: "false", value: false },
    ],
  },
  {
    label: "Active",
    value: "active",
    type: "checkbox",
    options: [
      { label: "true", value: true },
      { label: "false", value: false },
    ],
  },
  {
    label: "P95",
    value: "p95",
    type: "slider",
    min: 0,
    max: 3000,
    // TODO: we should have options here as well to guide the user
    // + performance improvements as we will render 3000 divs
  },
  {
    label: "Regions",
    value: "regions",
    type: "checkbox",
    options: [
      { label: "ams", value: "ams" },
      { label: "fra", value: "fra" },
      { label: "hkg", value: "hkg" },
      { label: "iad", value: "iad" },
      { label: "gru", value: "gru" },
      { label: "syd", value: "syd" },
    ],
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
    options: [
      // TODO: we could include some more descriptions (like the full name "Amsterdam") maybe with text-popover-muted
      { label: "web", value: "web" },
      { label: "api", value: "api" },
      { label: "enterprise", value: "enterprise" },
      { label: "app", value: "app" },
    ],
  },
] satisfies DataTableFilterField<Schema>[];
