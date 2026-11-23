export const galleryPlaceholder = "/images/gallery-unavailable.svg"

const missingLegacyImages = new Set([
  "business-cards-1", "packaging-1", "labels-1", "brochures-1", "banners-1",
  "stickers-1", "packaging-2", "letterheads-1", "bags-1", "brochures-2",
  "decals-1", "invitations-1", "specialty-1", "placeholder",
].map(name => `/gallery/${name}.jpg`))

export function publicGalleryImageUrl(src: string) {
  if (/\p{Cc}/u.test(src)) return null
  if (/^\/(?![\/\\])/.test(src)) return src
  try {
    const url = new URL(src)
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password
      ? url.href : null
  } catch {
    return null
  }
}

export function galleryImageSource(src?: string | null) {
  if (!src || src === galleryPlaceholder || missingLegacyImages.has(src)) return null
  return publicGalleryImageUrl(src)
}

export function cloudinaryImageSet(src: string, detail: boolean) {
  // Restrict transforms to ordinary versioned Cloudinary uploads. Keep signed
  // URLs, custom domains and pre-transformed URLs on their existing delivery path.
  if (!/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/[^?#]+$/.test(src)) return undefined
  const widths = detail ? [480, 800, 1200, 1600] : [320, 480, 640, 960]
  return widths.map(width => `${src.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)} ${width}w`).join(", ")
}
