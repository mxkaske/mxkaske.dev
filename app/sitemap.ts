import {
  allBrews,
  allCrafts,
  allPhotos,
} from "@/.content-collections/generated";
import { MetadataRoute } from "next";

const crafts = allCrafts.map((craft) => ({
  url: `https://craft.mxkaske.dev/post/${craft.slug}`,
  lastModified: craft.date,
}));

const brews = allBrews.map((brew) => ({
  url: `https://brew.mxkaske.dev/post/${brew.slug}`,
  lastModified: brew.date,
}));

const photos = allPhotos.map((photo) => ({
  url: `https://gallery.mxkaske.dev/photo/${photo.slug}`,
  lastModified: photo.date,
}));

const rest = [
  {
    url: "https://mxkaske.dev",
    lastModified: new Date(),
  },
  {
    url: "https://gallery.mxkaske.dev",
    lastModified: new Date(),
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...crafts, ...brews, ...photos, ...rest];
}
