"use client"

import Image from "next/image"
import { Printer, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { cloudinaryImageSet, galleryImageSource } from "@/lib/gallery-media"

export function MediaFallback({ icon: Icon = Printer, text = "Photo unavailable" }: { icon?: LucideIcon; text?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-page-secondary to-page-tertiary px-4 text-center text-secondary">
      <Icon aria-hidden="true" className="size-12 rounded-xl border border-light bg-page-primary p-3" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}

export function MediaFrame({ src, alt, sizes, className = "object-cover", icon, detail = false }: {
  src?: string | null
  alt: string
  sizes: string
  className?: string
  icon?: LucideIcon
  detail?: boolean
}) {
  const image = galleryImageSource(src)
  const [failed, setFailed] = useState<string | null>(null)
  if (!image || failed === image) return <MediaFallback icon={icon} />

  if (image.startsWith("/images/")) {
    return <Image src={image} alt={alt} fill sizes={sizes} className={className} onError={() => setFailed(image)} />
  }

  // Existing remote URLs are loaded in the browser, never proxied by the server.
  // eslint-disable-next-line @next/next/no-img-element
  return <img
    src={image}
    srcSet={cloudinaryImageSet(image, detail)}
    sizes={sizes}
    alt={alt}
    loading={detail ? "eager" : "lazy"}
    decoding="async"
    referrerPolicy="no-referrer"
    onError={() => setFailed(image)}
    className={`absolute inset-0 h-full w-full ${className}`}
  />
}
