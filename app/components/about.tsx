"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { MapPin, Globe, Clock, Zap } from "lucide-react"
import { useTheme } from "@/app/theme-provider"

export function AboutUs() {
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  const stats = [
    { icon: Globe, value: "15+", label: "Countries Served" },
    { icon: Clock, value: "28", label: "Years Experience" },
    { icon: Zap, value: "99.8%", label: "Satisfaction Rate" },
  ]

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1300)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="bg-page-primary relative">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image Skeleton */}
            <div className="relative">
              <div className="w-full h-[500px] bg-page-tertiary rounded-2xl animate-pulse"></div>
              
              {/* Stats overlay skeleton */}
              <div className="absolute -bottom-6 left-6 right-6 bg-page-secondary rounded-xl p-6 border border-light shadow-lg">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="text-center">
                      <div className="w-6 h-6 bg-page-tertiary rounded mb-2 animate-pulse mx-auto"></div>
                      <div className="h-8 bg-page-tertiary rounded mb-2 animate-pulse w-12 mx-auto"></div>
                      <div className="h-4 bg-page-tertiary rounded animate-pulse w-16 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Content Skeleton */}
            <div>
              <div className="h-4 bg-page-tertiary rounded mb-4 animate-pulse w-20"></div>
              <div className="h-12 bg-page-tertiary rounded mb-6 animate-pulse w-3/4"></div>
              <div className="space-y-4 mb-8">
                <div className="h-4 bg-page-tertiary rounded animate-pulse"></div>
                <div className="h-4 bg-page-tertiary rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-page-tertiary rounded animate-pulse w-4/5"></div>
              </div>
              
              <div className="space-y-4 mb-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-page-tertiary rounded-full animate-pulse"></div>
                    <div className="h-4 bg-page-tertiary rounded animate-pulse w-3/4"></div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="h-12 bg-page-tertiary rounded-full animate-pulse w-32"></div>
                <div className="h-12 bg-page-tertiary rounded-full animate-pulse w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-page-primary relative">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/images/Office-Image-2.jpg"
                alt="Awais Printers Office"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            {/* Stats overlay */}
            <div className="absolute -bottom-6 left-6 right-6 bg-page-secondary backdrop-blur-sm rounded-xl p-6 border border-light shadow-lg">
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-secondary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <p className="text-accent text-sm font-medium mb-4 tracking-wide">ABOUT US</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Awais Printers</h2>
            <p className="text-secondary text-lg leading-relaxed mb-8">
              Founded in February 1999, Awais Printers has been a cornerstone in the textile printing industry for over
              two decades. We specialize in printing high-quality garment accessories, including hang tags, size cards,
              woven labels, care labels, and leather patches.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <p className="text-secondary">Over 26 years of printing excellence</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <p className="text-secondary">State-of-the-art printing technology</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <p className="text-secondary">Professional design and printing services</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                About Us
              </Link>
              <Link
                href="#location"
                className="px-8 py-3 bg-page-secondary text-primary font-semibold rounded-full border border-light hover:border-accent hover:text-accent transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Find A Location
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Colorful bottom stripe - Consistent with theme */}
      <div className="h-1 bg-gradient-to-r from-accent via-transparent to-accent opacity-50" />
      
      {/* Striped bars at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 flex">
        <div className="flex-1 bg-gray-400" />
        <div className="flex-1 bg-gray-600" />
        <div className="flex-1 bg-gray-400" />
        <div className="flex-1 bg-gray-600" />
        <div className="flex-1 bg-gray-400" />
        <div className="flex-1 bg-gray-600" />
      </div>
    </section>
  )
}