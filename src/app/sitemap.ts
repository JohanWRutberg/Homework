import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { templates } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    { url: `${site.url}/hemuppgifter` },
    { url: `${site.url}/integritet` },
    ...templates.map((t) => ({ url: `${site.url}/hemuppgifter/${t.slug}` })),
  ];
}
