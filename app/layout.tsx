import type { Metadata } from "next"
import "./globals.css"
import { siteUrl } from "@/lib/site-metadata"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Awais Printers",
  icons: { icon: "/favicon.svg" },
}

// Apply the saved or system theme before the page paints.
const initializeTheme = `(() => {
  let theme;
  try { theme = localStorage.getItem("theme"); } catch {}
  if (theme !== "light" && theme !== "dark") theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
})();`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
      </head>
      <body id="top">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-page-primary focus:px-4 focus:py-2">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
