import { allBrews, allCrafts } from "@/.content-collections/generated";
import { MetadataRoute } from "next";

const crafts = allCrafts.map(craft => ({
    url: `https://craft.mxkaske.dev/post/${craft.slug}`,
    lastModified: craft.date,
}))

const brews = allBrews.map(brew => ({
    url: `https://brew.mxkaske.dev/post/${brew.slug}`,
    lastModified: brew.date,
}))

const rest = [{
    url: "https://mxkaske.dev",
    lastModified: new Date(),
}]


export default function sitemap(): MetadataRoute.Sitemap {
    return [...crafts, ...brews, ...rest];
}