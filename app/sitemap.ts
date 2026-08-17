import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const now = new Date();
  return [
    { url: `${origin}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/mission-management.html`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}/workflow.html`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/ontology.html`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/manual.html`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}