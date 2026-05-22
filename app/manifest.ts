import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tolmol — Compare prices across every Pakistani store",
    short_name: "Tolmol",
    description:
      "Search any product once and compare live PKR prices across every major Pakistani store.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#030712",
    lang: "en-PK",
    categories: ["shopping", "lifestyle", "utilities"],
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" }
    ]
  };
}
