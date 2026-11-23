import Image from "next/image"
import Link from "next/link"
import { MediaFallback } from "./media-frame"

export function Services() {
  
  const services = [
    {
      name: "Leather Embossing",
      image: "/images/Leather Embosing.jpg",
    },
    {
      name: "Flexo Printing",
      image: null,
    },
    {
      name: "Foil Printing",
      image: "/images/Foil Printing.jpg",
    },
    {
      name: "Screen Printing",
      image: "/images/Screen Printing.jpg",
    },
    {
      name: "Offset Printing",
      image: "/images/Offset Printing.jpg",
    },
    {
      name: "Thermal Stickers",
      image: null,
    },
    {
      name: "Rubber Labels",
      image: null,
    },
  ]

  return (
    <section className="relative flex flex-col lg:flex-row bg-page-primary">
      {/* Left side - Dark text section with page background */}
      <div className="lg:w-[30%] px-8 lg:px-16 py-16 lg:py-24 flex flex-col justify-center bg-page-secondary">
        <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-primary">Services</h2>
        <p className="text-secondary text-lg leading-relaxed">
          Online and in store, you can find printing services to help you get the job done
        </p>
      </div>

      {/* Right side - Services cards with same page background */}
      <div className="min-w-0 lg:w-[70%] py-16 lg:py-20 relative bg-page-primary">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-8 lg:px-12 pb-4">
            {services.map(service => (
              <Link prefetch={false} key={service.name} href="/services" className="flex-shrink-0 w-[280px] group rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                <div className="relative h-[180px] overflow-hidden rounded-lg mb-4 bg-page-tertiary border border-light">
                  {service.image ? (
                    <Image src={service.image} alt="" fill sizes="280px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : <MediaFallback />}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-primary text-center group-hover:text-accent transition-colors">
                  {service.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Colorful bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-gray-400" />
          <div className="flex-1 bg-gray-600" />
          <div className="flex-1 bg-gray-400" />
          <div className="flex-1 bg-gray-600" />
          <div className="flex-1 bg-gray-400" />
          <div className="flex-1 bg-gray-600" />
        </div>
      </div>

    </section>
  )
}