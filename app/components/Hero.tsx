"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

const slides = [
  { title: "Let Us Help You With All Of Your Printing Needs", button: "Contact Us", href: "/contact", image: "/images/image-1.jpg", focalPoint: "50% 50%" },
  { title: "Elevate Your Brand Identity With Our Exclusive Leather Patches", button: "Know More", href: "/services", image: "/images/Leather Embosing.jpg", focalPoint: "42% 50%" },
  { title: "Transform Your Designs With Our Screen Printing", button: "Explore More", href: "/services", image: "/images/Screen Printing.jpg", focalPoint: "55% 50%" },
  { title: "Unmatched Quality With Our Advanced Offset Printing", button: "For More", href: "/services", image: "/images/image-4.jpg", focalPoint: "48% 50%" },
]

const control = "inline-flex h-11 w-11 items-center justify-center rounded-full border border-light bg-page-secondary text-primary transition-colors hover:bg-page-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const slide = slides[current]
  const imageOnRight = current % 2 === 1

  useEffect(() => {
    if (paused || hovered) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const timer = window.setTimeout(() => {
      if (!motion.matches && !document.hidden) setCurrent(index => (index + 1) % slides.length)
    }, 8000)
    return () => window.clearTimeout(timer)
  }, [current, paused, hovered])

  const chooseSlide = (index: number) => {
    setPaused(true)
    setCurrent((index + slides.length) % slides.length)
  }

  return (
    <section
      aria-label="Featured printing services"
      aria-roledescription="carousel"
      className="relative isolate min-h-[calc(100svh-5rem)] flex flex-col overflow-hidden bg-page-secondary"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => {
        const from = event.relatedTarget
        if (!event.currentTarget.contains(from) && !event.target.closest(".hero-rotation")) setPaused(true)
      }}
    >
      <div data-side={imageOnRight ? "right" : "left"} className={`hero-photo absolute inset-x-0 top-0 h-[62%] -z-10 md:h-full md:w-3/5 ${imageOnRight ? "md:left-auto" : "md:right-auto"}`}>
        <Image
          key={slide.image}
          src={slide.image}
          alt=""
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          loading={current === 0 ? "eager" : "lazy"}
          fetchPriority={current === 0 ? "high" : undefined}
          className="object-cover"
          style={{ objectPosition: slide.focalPoint }}
        />
      </div>

      <div className={`container mx-auto min-h-[26rem] flex flex-1 items-end px-5 pt-36 pb-3 sm:px-8 md:items-center md:py-12 ${imageOnRight ? "md:justify-start" : "md:justify-end"}`}>
        <div className={`w-full md:max-w-[55%] lg:max-w-lg ${imageOnRight ? "md:text-left" : "md:text-right"}`}>
          <h1 className={current === 0 ? "hero-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-primary" : "sr-only"}>
            {slides[0].title}
          </h1>
          {current !== 0 && (
            <h2 className="hero-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-primary" aria-live={paused ? "polite" : "off"}>
              {slide.title}
            </h2>
          )}
          <Link prefetch={false} href={slide.href} className="mt-5 md:mt-8 inline-flex px-8 py-4 bg-accent hover:opacity-90 text-white font-bold rounded-full shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            {slide.button}
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 px-3 pt-2 pb-4 md:pb-7" role="group" aria-label="Slide controls">
        <button type="button" className={control} aria-label="Previous slide" onClick={() => chooseSlide(current - 1)}>
          <ChevronLeft className="size-6" />
        </button>
        {slides.map((item, index) => (
          <button key={item.image} type="button" className={control} aria-current={current === index ? "true" : undefined}
            aria-label={`Go to slide ${index + 1}`} onClick={() => chooseSlide(index)}>
            <span className={`h-2.5 rounded-full ${current === index ? "w-5 bg-accent" : "w-2.5 bg-current opacity-40"}`} />
          </button>
        ))}
        <button type="button" className={control} aria-label="Next slide" onClick={() => chooseSlide(current + 1)}>
          <ChevronRight className="size-6" />
        </button>
        <button type="button" className={`${control} hero-rotation`} aria-label={paused ? "Start slideshow" : "Pause slideshow"} onClick={() => setPaused(value => !value)}>
          {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
        </button>
      </div>
    </section>
  )
}
