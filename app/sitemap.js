import { breeds } from "@/data/breeds";

export default function sitemap() {
  const baseUrl = "https://realistic-dog-cost-calculator-seven.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...breeds.map((breed) => ({
      url: `${baseUrl}/honden/${breed.slug}`,
      lastModified: new Date(),
    })),
  ];
}