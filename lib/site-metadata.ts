import type { Metadata } from "next"

export const siteUrl = "https://www.awaisprinters.com"
const siteName = "Awais Printers"

const pages = {
  "/": {
    title: "Awais Printers | Professional Printing Services",
    description: "Explore Awais Printers’ printing services in Lahore, from business cards and garment accessories to labels, packaging, and specialty finishes.",
  },
  "/services": {
    title: "Printing Services | Awais Printers",
    description: "Compare digital, offset, and screen printing, packaging, garment accessories, and other printing services from Awais Printers.",
  },
  "/gallery": {
    title: "Printing Gallery | Awais Printers",
    description: "Browse printing projects by category, including business cards, packaging, labels, brochures, and banners.",
  },
  "/about": {
    title: "About Us | Awais Printers",
    description: "Get to know Awais Printers in Lahore, including our printing capabilities, work process, and approach to quality.",
  },
  "/contact": {
    title: "Contact & Request a Quote | Awais Printers",
    description: "Request a printing quote, call or message Awais Printers, or find directions to our location in Ichra, Lahore.",
  },
} as const

type PublicPage = keyof typeof pages

export const publicPaths = Object.keys(pages) as PublicPage[]

export function publicMetadata(path: PublicPage): Metadata {
  const { title, description } = pages[path]
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      siteName,
      url: path,
      images: [{ url: "/images/image-4.jpg", width: 3379, height: 1843, alt: "Commercial printing press" }],
    },
  }
}

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  telephone: "+923224432533",
}
