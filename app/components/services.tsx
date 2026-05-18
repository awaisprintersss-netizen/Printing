"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "@/app/theme-provider"

export function Services() {
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  
  const services = [
    {
      name: "Leather Embossing",
      image: "/images/Leather Embosing.jpg",
    },
    {
      name: "Flexo Printing",
      image: "/images/Flexo Printing.jpg",
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
      image: "/images/Thermal Stickers.jpg",
    },
    {
      name: "Rubber Labels",
      image: "/images/Rubber Labels.jpg",
    },
  ]

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="relative flex flex-col lg:flex-row bg-page-primary">
        {/* Left side - Text skeleton */}
        <div className="lg:w-[30%] px-8 lg:px-16 py-16 lg:py-24 flex flex-col justify-center bg-page-secondary">
          <div className="h-12 bg-page-tertiary rounded mb-6 animate-pulse w-1/2"></div>
          <div className="h-4 bg-page-tertiary rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-page-tertiary rounded animate-pulse w-3/4"></div>
        </div>

        {/* Right side - Services cards skeleton */}
        <div className="lg:w-[70%] py-16 lg:py-20 relative bg-page-primary">
          <div className="flex gap-6 px-8 lg:px-12 pb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index} className="flex-shrink-0 w-[280px]">
                <div className="relative h-[180px] bg-page-tertiary rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-page-tertiary rounded animate-pulse w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

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
      <div className="lg:w-[70%] py-16 lg:py-20 relative bg-page-primary">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-8 lg:px-12 pb-4">
            {services.map((service, index) => (
              <div key={index} className="flex-shrink-0 w-[280px] group cursor-pointer">
                <div className="relative h-[180px] overflow-hidden rounded-lg mb-4 bg-page-tertiary border border-light">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-primary text-center group-hover:text-accent transition-colors">
                  {service.name}
                </h3>
              </div>
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

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}