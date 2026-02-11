import type { MetadataRoute } from "next";
import { getIndexedAgents, getIndexedTasks, getIndexedCurves } from "@/lib/indexer";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://agents.fixr.nexus";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${base}/tasks`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/launchpad`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/leaderboard`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/terms`, lastModified: new Date("2026-02-10"), changeFrequency: "monthly", priority: 0.2 },
    { url: `${base}/privacy`, lastModified: new Date("2026-02-10"), changeFrequency: "monthly", priority: 0.2 },
    { url: `${base}/disclaimer`, lastModified: new Date("2026-02-10"), changeFrequency: "monthly", priority: 0.2 },
  ];

  // Dynamic agent pages
  const agents = await getIndexedAgents();
  const agentRoutes: MetadataRoute.Sitemap = agents.map((a) => ({
    url: `${base}/agent/${encodeURIComponent(a.principal)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Dynamic task pages
  const tasks = await getIndexedTasks();
  const taskRoutes: MetadataRoute.Sitemap = tasks.map((t) => ({
    url: `${base}/task/${t.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // Dynamic token/curve pages
  const curves = await getIndexedCurves();
  const curveRoutes: MetadataRoute.Sitemap = curves.map((c) => ({
    url: `${base}/token/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...agentRoutes, ...taskRoutes, ...curveRoutes];
}
