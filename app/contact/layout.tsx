import type { ReactNode } from "react"
import { publicMetadata } from "@/lib/site-metadata"

export const metadata = publicMetadata("/contact")

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
