export const SITE = {
  name: "Rootline Technology",
  legalName: "Rootline Technology Pvt Ltd",
  tagline: "Engineering at the root.",
  description:
    "Rootline Technology builds secure, modern software — VAPT, mobile apps in Flutter, and production web platforms.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: "/logo.png",
  defaultOgImage: "/og-default.png",
  twitter: "@rootlinetech",
  locale: "en_US",
  contact: {
    email: "hello@rootline.tech",
    phone: "",
    address: process.env.COMPANY_ADDRESS ?? "Kathmandu, Nepal",
    geo: {
      lat: Number(process.env.GEO_LAT ?? 27.7172),
      lng: Number(process.env.GEO_LNG ?? 85.324),
    },
  },
} as const;
