"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "@/app/theme-provider"

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  const slides = [
    {
      id: 1,
      title: "Let Us Help You With All Of Your Printing Needs",
      button: "Contact Us",
      gradientLight: "linear-gradient(to bottom right, #ffffff, #f8f9fa, #ffffff)",
      gradientDark: "linear-gradient(to bottom right, #121212, #1a1a1a, #121212)",
  image: "/images/image-1.jpg",
      imagePosition: "right",
    },
    {
      id: 2,
      title: "Elevate Your Brand Identity With Our Exclusive Leather Patches",
      button: "Know More",
      gradientLight: "linear-gradient(to bottom right, #f8f9fa, #ffffff, #f8f9fa)",
      gradientDark: "linear-gradient(to bottom right, #1a1a1a, #121212, #1a1a1a)",
  image: "/images/image-2.jpg",
      imagePosition: "left",
    },
    {
      id: 3,
      title: "Transform Your Designs With Our Screen Printing",
      button: "Explore More",
      gradientLight: "linear-gradient(to bottom right, #f1f3f5, #ffffff, #f1f3f5)",
      gradientDark: "linear-gradient(to bottom right, #2d2d2d, #121212, #2d2d2d)",
  image: "/images/image-3.jpg",
      imagePosition: "right",
    },
    {
      id: 4,
      title: "Unmatched Quality With Our Advanced Offset Printing",
      button: "For More",
      gradientLight: "linear-gradient(to bottom right, #ffffff, #f1f3f5, #ffffff)",
      gradientDark: "linear-gradient(to bottom right, #121212, #2d2d2d, #121212)",
  image: "/images/image-4.jpg",
      imagePosition: "left",
    },
  ]

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true)
      setCurrentSlide(index)
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide, isAnimating])

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="relative h-screen overflow-hidden bg-page-primary">
        <div className="container mx-auto h-full px-4 md:px-8">
          <div className="h-full grid md:grid-cols-[55%_45%] grid-cols-1 gap-8 items-center">
            {/* Text Content Skeleton */}
            <div className="flex flex-col justify-center items-start text-left">
              <div className="h-16 bg-page-tertiary rounded mb-8 animate-pulse w-3/4"></div>
              <div className="h-16 bg-page-tertiary rounded mb-8 animate-pulse w-1/2"></div>
              <div className="h-14 bg-page-tertiary rounded-full animate-pulse w-40"></div>
            </div>

            {/* Image Skeleton */}
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-page-tertiary rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows Skeleton */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-page-tertiary animate-pulse"></div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-page-tertiary animate-pulse"></div>

        {/* Pagination Dots Skeleton */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="w-3 h-3 bg-page-tertiary rounded-full animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .slide-enter {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .text-enter-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }

        .text-enter-right {
          animation: slideInFromRight 0.8s ease-out forwards;
        }

        .image-enter-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }

        .image-enter-right {
          animation: slideInFromRight 0.8s ease-out forwards;
        }
      `}</style>

      <section className="relative h-screen overflow-hidden bg-page-primary">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-800 ${
              index === currentSlide ? "opacity-100 z-10 slide-enter" : "opacity-0 z-0"
            }`}
            style={{
              background: theme === 'dark' ? slide.gradientDark : slide.gradientLight,
            }}
          >
            {/* Full screen image with space for text */}
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className={`absolute w-full h-full object-cover ${
                slide.imagePosition === "left"
                  ? "right-0 md:right-0 lg:w-3/5 xl:w-2/3"
                  : "left-0 md:left-0 lg:w-3/5 xl:w-2/3"
              } ${
                index === currentSlide
                  ? slide.imagePosition === "left"
                    ? "image-enter-left"
                    : "image-enter-right"
                  : "opacity-0"
              }`}
              style={{
                filter: theme === 'dark'
                  ? "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))"
                  : "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))",
              }}
            />

            {/* Text Content */}
            <div
              className={`absolute inset-0 flex items-center ${
                slide.imagePosition === "left" ? "justify-start pl-8 md:pl-16" : "justify-end pr-8 md:pr-16"
              } ${index === currentSlide ? (slide.imagePosition === "left" ? "text-enter-left" : "text-enter-right") : "opacity-0"}`}
            >
              <div className={`max-w-lg ${slide.imagePosition === "left" ? "text-left" : "text-right"}`}>
                                <h1
  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight text-primary"
  style={{
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: theme === "dark" ? "#ffffff" : "#111827",
    WebkitTextStroke:
      theme === "dark"
        ? "1px rgba(0, 0, 0, 0.9)"
        : "1px rgba(255, 255, 255, 0.9)",
    textShadow:
      theme === "dark"
        ? "0 0 8px rgba(0, 0, 0, 0.9), 0 0 12px rgba(0, 0, 0, 0.55)"
        : "0 0 8px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.55)",
  }}
>
  {slide.title}
</h1>
                <button
                  className="px-8 py-4 bg-accent hover:opacity-90 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  {slide.button}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform border border-light"
          aria-label="Previous slide"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform border border-light"
          aria-label="Next slide"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 hover:scale-120 ${
                index === currentSlide 
                  ? "w-12 h-3 bg-accent" 
                  : "w-3 h-3 bg-current opacity-30"
              }`}
              style={{
                color: 'var(--text-primary)'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  )
}