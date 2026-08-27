import type { MetadataRoute } from "next";
import { breeds } from "@/data/breeds";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    "/", "/dog-cost-calculator", "/puppy-cost-calculator", "/dog-cost-per-month",
    "/dog-cost-per-year", "/breeds", "/compare", "/can-i-afford-a-dog", "/emergency-fund",
    "/faq", "/privacy", "/terms", "/disclaimer", "/contact",
  ];
  return [
    ...paths.map((path) => ({ url: `${base}${path}` })),
    ...breeds.map((breed) => ({ url: `${base}/breeds/${breed.slug}-cost` })),
  ];
}
