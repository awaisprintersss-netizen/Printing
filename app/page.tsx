import { Footer } from "./components/footer"
import { Header } from "./components/header"
import { Hero } from "./components/Hero"
import { Services } from "./components/services"
import { AboutUs } from "./components/about"
import { FAQ } from "./components/faq"
import { organization, publicMetadata } from "@/lib/site-metadata"

export const metadata = publicMetadata("/")

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
      <Header />
      <main id="main-content" tabIndex={-1} className="scroll-mt-20">
        <Hero />
        <Services />
        <AboutUs />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
