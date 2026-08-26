import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Realistic Dog Cost Calculator",
    short_name: "Dog Cost Calculator",
    description: "Estimate realistic dog ownership costs.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f7a58",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
