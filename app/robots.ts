import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/add-vehicle/",
        "/edit-vehicle/",
        "/vehicle/",
        "/view-vehicle/",
      ],
    },
    sitemap: "https://vehix.co.in/sitemap.xml",
  };
}