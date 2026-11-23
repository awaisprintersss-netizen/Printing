"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { 
  Search, Filter, X, ZoomIn, 
  Heart, Printer, Palette, 
  Award, Clock,
  Grid, List, ChevronLeft, ChevronRight
} from "lucide-react"
import { GalleryItem, GalleryCategory } from "@/types/gallery"
import { GalleryLoading } from "../components/GalleryLoading"
import { MediaFrame } from "../components/media-frame"

function readFavorites(): string[] {
  if (typeof window === "undefined") return []
  try {
    const saved: unknown = JSON.parse(localStorage.getItem("galleryFavorites") ?? "[]")
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : []
  } catch {
    return []
  }
}

type GallerySort = "newest" | "favorite" | "alphabetical"

function projectYear(year: string) {
  return /^\d{4}$/.test(year.trim()) ? Number(year) : 0
}

export function GalleryBrowser() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState<GallerySort>("newest")
  const lightbox = useRef<HTMLDialogElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState(readFavorites)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [categories, setCategories] = useState<GalleryCategory[]>([
    { id: "all", name: "All Projects", count: 0 },
    { id: "business", name: "Business Cards", count: 0 },
    { id: "packaging", name: "Packaging", count: 0 },
    { id: "labels", name: "Labels & Stickers", count: 0 },
    { id: "brochures", name: "Brochures", count: 0 },
    { id: "banners", name: "Banners", count: 0 },
    { id: "specialty", name: "Specialty Printing", count: 0 },
  ])

  useEffect(() => {
    const controller = new AbortController()
    const fetchGalleryData = async () => {
      try {
        const response = await fetch('/api/gallery', { signal: controller.signal })
        if (!response.ok) throw new Error('Gallery request failed')
        const data = await response.json()
        if (controller.signal.aborted) return
        if (data.success) {
          setGalleryItems(data.items)
          
          // Update category counts
          const categoryCounts: Record<string, number> = {}
          data.items.forEach((item: GalleryItem) => {
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
          })
          
          setCategories(prev => prev.map(cat => ({
            ...cat,
            count: cat.id === 'all' ? data.items.length : categoryCounts[cat.id] || 0
          })))
        } else {
          setError('The gallery is temporarily unavailable.')
        }
        
      } catch {
        if (!controller.signal.aborted) setError('The gallery is temporarily unavailable.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchGalleryData()
    return () => controller.abort()
  }, [attempt])

  // Save favorites to localStorage
  useEffect(() => {
    if (galleryItems.length === 0) return
    try {
      localStorage.setItem('galleryFavorites', JSON.stringify(favorites))
    } catch {
      // The gallery and in-memory favorites still work when storage is blocked.
    }
  }, [favorites, galleryItems])

  const favoriteIds = new Set(favorites)
  const sortedItems = [...galleryItems].sort((left, right) => {
    const byTitle = left.title.localeCompare(right.title, "en")
    if (sort === "alphabetical") return byTitle
    const byYear = projectYear(right.year) - projectYear(left.year)
    if (sort === "favorite") {
      const byFavorite = Number(favoriteIds.has(String(right.id))) - Number(favoriteIds.has(String(left.id)))
      if (byFavorite) return byFavorite
    }
    return byYear || byTitle
  })
  const query = searchQuery.trim().toLowerCase()
  const filteredItems = sortedItems.filter(item =>
    (selectedCategory === "all" || item.category === selectedCategory) &&
    [item.title, item.description, item.client, ...item.tags].some(text => text.toLowerCase().includes(query))
  )

  const itemsPerPage = 9
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  const stats = [
    { icon: Printer, value: `${galleryItems.length}+`, label: "Print Projects" },
    { icon: Palette, value: "200+", label: "Happy Clients" },
    { icon: Award, value: "95%", label: "Repeat Business" },
    { icon: Clock, value: "28", label: "Years Experience" },
  ]

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

  const openLightbox = (id: string) => {
    setSelectedImage(id)
  }

  const closeLightbox = () => lightbox.current?.close()

  const selectedItem = selectedImage ? galleryItems.find(item => String(item.id) === selectedImage) : null
  const lightboxItems = selectedItem && filteredItems.includes(selectedItem) ? filteredItems : sortedItems
  const lightboxIndex = selectedItem ? lightboxItems.indexOf(selectedItem) : -1
  const moveLightbox = (step: number) => {
    const next = lightboxItems[(lightboxIndex + step + lightboxItems.length) % lightboxItems.length]
    if (next) setSelectedImage(String(next.id))
  }
  const lightboxOpen = !!selectedItem

  useEffect(() => {
    if (!lightboxOpen) return
    if (!lightbox.current?.open) lightbox.current?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [lightboxOpen])

  if (loading) return <div id="gallery-items" className="scroll-mt-20"><GalleryLoading /></div>

  if (error) {
    return (
        <div id="gallery-items" className="min-h-64 scroll-mt-20 bg-page-primary flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-primary mb-4">Error Loading Gallery</h2>
            <p className="text-secondary mb-6">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                setLoading(true)
                setAttempt(previous => previous + 1)
              }}
              className="px-6 py-3 bg-accent text-white rounded-full hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
    )
  }

  return (
    <>
      {/* Stats Section */}
      <section className="py-12 bg-page-primary border-b border-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Controls */}
      <section id="gallery-items" className="py-8 bg-page-secondary lg:sticky lg:top-20 scroll-mt-20 z-40 border-b border-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                aria-label="Search projects"
                placeholder="Search projects by keyword, client, or tag..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1) }}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              )}
            </div>

            {/* Categories & View Toggle */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary" />
                <select
                  aria-label="Filter projects by category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 rounded-full bg-page-primary border border-light text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-page-primary rounded-full p-1 border border-light">
                <button
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full transition-colors ${viewMode === "grid" ? "bg-accent text-white" : "text-secondary hover:text-primary"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  aria-label="Masonry view"
                  aria-pressed={viewMode === "masonry"}
                  onClick={() => setViewMode("masonry")}
                  className={`p-2 rounded-full transition-colors ${viewMode === "masonry" ? "bg-accent text-white" : "text-secondary hover:text-primary"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategory !== "all" && (
              <button
                onClick={() => { setSelectedCategory("all"); setCurrentPage(1) }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm hover:bg-accent/20 transition-colors"
              >
                {categories.find(c => c.id === selectedCategory)?.name}
                <X className="w-3 h-3" />
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setCurrentPage(1) }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm hover:bg-accent/20 transition-colors"
              >
                Search: &quot;{searchQuery}&quot;
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-page-primary">
        <div className="container mx-auto px-4">
          {/* Results Info */}
          <h2 className="sr-only">Gallery results</h2>
          <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
            <div className="text-secondary">
              Showing <span className="font-semibold text-primary">{filteredItems.length}</span> of <span className="font-semibold text-primary">{galleryItems.length}</span> projects
              {selectedCategory !== "all" && (
                <span> in <span className="font-semibold text-primary">{categories.find(c => c.id === selectedCategory)?.name}</span></span>
              )}
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <span>Sort by:</span>
              <select aria-label="Sort projects" value={sort} onChange={event => { setSort(event.target.value as GallerySort); setCurrentPage(1) }} className="bg-page-primary rounded px-1 py-0.5 text-primary">
                <option value="newest">Newest project year</option>
                <option value="favorite">Favorites first</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </div>
          </div>

          {/* Gallery Items */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-page-tertiary mb-6">
                <Search className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">No projects found</h3>
              <p className="text-secondary mb-6 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setSearchQuery("")
                  setCurrentPage(1)
                }}
                className="px-6 py-2 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`${viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3" : "columns-1 md:columns-2 lg:columns-3"} gap-6`}>
                {paginatedItems.map((item) => (
                  <div key={item.id} className={`${viewMode === "masonry" ? "mb-6 break-inside-avoid" : ""}`}>
                    <div className="group bg-page-secondary rounded-2xl overflow-hidden border border-light hover:border-accent transition-all duration-300 hover:shadow-xl">
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-page-tertiary">
                        {/* Actual Image */}
                        <MediaFrame src={item.image} alt={item.title} sizes="(min-width: 1280px) 400px, (min-width: 1024px) 32vw, (min-width: 768px) 48vw, calc(100vw - 32px)" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                        
                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity duration-300">
                          <button
                            aria-label={"Favorite: " + item.title}
                            aria-pressed={favoriteIds.has(String(item.id))}
                            onClick={() => toggleFavorite(item.id.toString())}
                            className={`p-2 rounded-full backdrop-blur-sm ${favorites.includes(item.id.toString()) ? 'bg-red-500/20 text-red-500' : 'bg-black/20 text-white hover:bg-black/30'}`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(item.id.toString()) ? 'fill-red-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => openLightbox(item.id.toString())}
                            aria-label={"Enlarge " + item.title}
                            className="p-2 rounded-full backdrop-blur-sm bg-black/20 text-white hover:bg-black/30"
                          >
                            <ZoomIn className="w-5 h-5" />
                          </button>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => openLightbox(item.id.toString())}
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-accent text-white font-semibold rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity duration-300 hover:opacity-90"
                        >
                          View Details
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2">
                              {categories.find(c => c.id === item.category)?.name || item.category}
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-secondary mb-1">Year</div>
                            <div className="font-semibold text-primary">{item.year}</div>
                          </div>
                        </div>

                        <p className="text-secondary text-sm mb-4 line-clamp-2">{item.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 rounded bg-page-tertiary text-xs text-secondary">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="px-2 py-1 rounded bg-page-tertiary text-xs text-secondary">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Client & Actions */}
                        <div className="flex justify-between items-center pt-4 border-t border-light">
                          <div>
                            <div className="text-xs text-secondary mb-1">Client</div>
                            <div className="font-medium text-primary">{item.client}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              aria-label={"Favorite: " + item.title}
                            aria-pressed={favoriteIds.has(String(item.id))}
                            onClick={() => toggleFavorite(item.id.toString())}
                              className={`p-2 rounded-full ${favorites.includes(item.id.toString()) ? 'text-red-500' : 'text-secondary hover:text-primary'}`}
                            >
                              <Heart className={`w-5 h-5 ${favorites.includes(item.id.toString()) ? 'fill-red-500' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-light text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-full font-medium ${
                          currentPage === pageNum
                            ? 'bg-accent text-white'
                            : 'text-secondary hover:text-primary hover:bg-page-tertiary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-light text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-page-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Featured Projects</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              A selection of our most notable and award-winning printing projects.
            </p>
          </div>

          {galleryItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.slice(0, 3).map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-page-tertiary mb-4">
                    {/* Actual Image */}
                    <MediaFrame src={item.image} alt={item.title} sizes="(min-width: 1280px) 400px, (min-width: 1024px) 32vw, (min-width: 768px) 48vw, calc(100vw - 32px)" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:translate-y-full lg:group-hover:translate-y-0 lg:group-focus-within:translate-y-0 transition-transform duration-300">
                      <button 
                        onClick={() => openLightbox(item.id.toString())}
                        className="w-full py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-secondary text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary">No featured projects available</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-page-secondary to-page-tertiary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Inspired By Our Work?
            </h2>
            <p className="text-xl text-secondary mb-8">
              Let&apos;s create something amazing together. Share your vision with us and
              let our team of experts bring it to life with exceptional printing quality.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact#quote"
                className="px-8 py-4 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg"
              >
                Start Your Project
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-page-primary text-primary font-semibold rounded-full border-2 border-light hover:border-accent transition-all text-lg"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && selectedItem && (
        <dialog
          ref={lightbox}
          aria-label="Gallery project details"
          onClose={() => setSelectedImage(null)}
          onClick={event => { if (event.target === event.currentTarget) closeLightbox() }}
          className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto rounded-2xl bg-page-secondary text-primary backdrop:bg-black/90"
        >
          <div className="relative w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              aria-label="Close gallery details"
              className="absolute top-3 right-3 z-10 rounded-full bg-page-primary p-2 text-primary hover:bg-page-tertiary transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Content */}
            <div className="bg-page-secondary rounded-2xl overflow-hidden">
              {/* Lightbox Image */}
              <div className="aspect-video bg-page-tertiary relative overflow-hidden">
                <MediaFrame src={selectedItem.image} alt={selectedItem.title} sizes="(min-width: 1184px) 1152px, calc(100vw - 32px)" className="object-contain" detail />
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent font-medium mb-3">
                      {categories.find(c => c.id === selectedItem.category)?.name || selectedItem.category}
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-3">
                      {selectedItem.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-secondary mb-1">Project Year</div>
                    <div className="text-2xl font-bold text-primary">
                      {selectedItem.year}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-primary mb-4">Project Details</h3>
                    <p className="text-secondary mb-6">
                      {selectedItem.description}
                    </p>
                    
                    <h4 className="font-bold text-primary mb-3">Techniques Used</h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedItem.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-page-tertiary text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>

                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4">Plan a similar project</h3>
                    <Link href="/contact#quote" className="inline-flex rounded-lg bg-accent px-4 py-3 font-semibold text-white">Request a quote</Link>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-light">
                  <button
                    onClick={() => moveLightbox(-1)}
                    disabled={lightboxItems.length < 2}
                    className="px-6 py-2 rounded-full border border-light text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                  
                  <div className="text-secondary">
                    Project {lightboxIndex + 1} of {lightboxItems.length}
                  </div>
                  
                  <button
                    onClick={() => moveLightbox(1)}
                    disabled={lightboxItems.length < 2}
                    className="px-6 py-2 rounded-full border border-light text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
